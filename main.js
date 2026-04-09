/*─────────────────────────────────────────
  main.js – ayanaMD by KennDev
  Entry point: koneksi Baileys v7 + loader
─────────────────────────────────────────*/

import './config.js';

import {
  default as makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  jidNormalizedUser,
} from '@whiskeysockets/baileys';

import { Boom }    from '@hapi/boom';
import pino        from 'pino';
import chalk       from 'chalk';
import chokidar    from 'chokidar';
import NodeCache   from 'node-cache';
import yargs       from 'yargs';
import { hideBin } from 'yargs/helpers';
import path        from 'path';
import fs          from 'fs';
import { promisify } from 'util';
import { fileURLToPath, pathToFileURL } from 'url';
import readline    from 'readline';
import lodash      from 'lodash';

import { handler, participantsUpdate } from './handler.js';
import { bindConnMethods } from './lib/serialize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const _          = lodash;
const readdir    = promisify(fs.readdir);
const stat       = promisify(fs.stat);

/*──────────────────────────────────────
  CLI opts
──────────────────────────────────────*/
global.opts = yargs(hideBin(process.argv))
  .option('pairing', { type: 'boolean', default: true })
  .option('autoread', { type: 'boolean', default: false })
  .option('queque',   { type: 'boolean', default: false })
  .option('noprefix', { type: 'boolean', default: false })
  .exitProcess(false)
  .parse();

global.prefix = new RegExp('^[xzXZ/!#$%+^=.\\-]');

/*──────────────────────────────────────
  Database
──────────────────────────────────────*/
const dbFilePath = path.join(__dirname, 'database.json');
const defaultDb  = { users: {}, chats: {}, stats: {}, msgs: {}, settings: { blockcmd: [] }, respon: {} };

global.db = {
  READ: false,
  data: null,
  async read() {
    try {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      this.data = JSON.parse(raw);
    } catch {
      this.data = null;
    }
  },
  async write(data) {
    try { fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2)); }
    catch (e) { console.error('DB write error:', e); }
  },
};

global.loadDatabase = async () => {
  if (db.data !== null) return;
  db.READ = true;
  await db.read();
  if (db.data === null) db.data = defaultDb;
  db.READ = false;
  db.data = { ...defaultDb, ...db.data };
  db.chain = _.chain(db.data);
};
await global.loadDatabase();

// Auto-save every 30s
setInterval(() => db.write(db.data || {}), 30_000);

/*──────────────────────────────────────
  Store – manual (makeInMemoryStore
  dihapus di Baileys v7)
──────────────────────────────────────*/
const storeFile = path.join(__dirname, 'session', 'store.json');

// Simple in-memory store compatible dengan v7
global.store = {
  messages: {},       // { jid: { [id]: msg } }
  contacts: {},       // { jid: contact }
  groupMetadata: {},  // { jid: metadata }

  bind(ev) {
    ev.on('messaging-history.set', ({ messages: msgs, contacts: cts, isLatest }) => {
      for (const m of msgs) {
        if (!m.key?.remoteJid) continue;
        this.messages[m.key.remoteJid] = this.messages[m.key.remoteJid] || {};
        this.messages[m.key.remoteJid][m.key.id] = m;
      }
      for (const c of (cts || [])) {
        if (c.id) this.contacts[c.id] = { ...(this.contacts[c.id] || {}), ...c };
      }
    });
    ev.on('messages.upsert', ({ messages: msgs }) => {
      for (const m of msgs) {
        if (!m.key?.remoteJid) continue;
        this.messages[m.key.remoteJid] = this.messages[m.key.remoteJid] || {};
        this.messages[m.key.remoteJid][m.key.id] = m;
      }
    });
    ev.on('contacts.upsert', (cts) => {
      for (const c of cts) {
        if (c.id) this.contacts[c.id] = { ...(this.contacts[c.id] || {}), ...c, isContact: true };
      }
    });
    ev.on('contacts.update', (cts) => {
      for (const c of cts) {
        if (c.id) this.contacts[c.id] = { ...(this.contacts[c.id] || {}), ...c };
      }
    });
    ev.on('groups.upsert', (groups) => {
      for (const g of groups) {
        if (g.id) this.groupMetadata[g.id] = g;
      }
    });
    ev.on('groups.update', (updates) => {
      for (const u of updates) {
        if (u.id) this.groupMetadata[u.id] = { ...(this.groupMetadata[u.id] || {}), ...u };
      }
    });
    ev.on('group-participants.update', ({ id, participants, action }) => {
      const meta = this.groupMetadata[id];
      if (!meta) return;
      if (action === 'add') {
        meta.participants = [
          ...(meta.participants || []),
          ...participants.map((p) => ({ id: p, admin: null })),
        ];
      } else if (action === 'remove') {
        meta.participants = (meta.participants || []).filter((p) => !participants.includes(p.id));
      } else if (action === 'promote') {
        for (const p of meta.participants || []) {
          if (participants.includes(p.id)) p.admin = 'admin';
        }
      } else if (action === 'demote') {
        for (const p of meta.participants || []) {
          if (participants.includes(p.id)) p.admin = null;
        }
      }
    });
  },

  loadMessage(jid, id) {
    return this.messages[jid]?.[id] || null;
  },

  readFromFile(filePath) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      this.messages      = data.messages      || {};
      this.contacts      = data.contacts      || {};
      this.groupMetadata = data.groupMetadata || {};
    } catch {}
  },

  writeToFile(filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify({
        messages:      this.messages,
        contacts:      this.contacts,
        groupMetadata: this.groupMetadata,
      }));
    } catch {}
  },
};

try { global.store.readFromFile(storeFile); } catch {}
setInterval(() => {
  try { global.store.writeToFile(storeFile); } catch {}
}, 10_000);

/*──────────────────────────────────────
  Scan plugins
──────────────────────────────────────*/
async function scanDir(dir) {
  const items = await readdir(dir);
  const files = await Promise.all(
    items.map(async (item) => {
      const res = path.resolve(dir, item);
      return (await stat(res)).isDirectory() ? scanDir(res) : res;
    })
  );
  return files.flat();
}

global.plugins = {};

async function loadPlugins() {
  try {
    const files = await scanDir(path.join(__dirname, 'plugins'));
    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const rel = file.replace(__dirname, '');
      try {
        const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
        global.plugins[rel] = mod.default || mod;
      } catch (e) {
        console.error(chalk.red(`[Plugin Load Error] ${rel}`), e.message);
      }
    }
    const sorted = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
    global.plugins = sorted;
    console.log(chalk.blue.bold(`[ayanaMD] Loaded ${Object.keys(global.plugins).length} plugins`));
  } catch (e) { console.error(e); }
}

await loadPlugins();

// Hot-reload watcher
const watcher = chokidar.watch(path.join(__dirname, 'plugins'), { persistent: true, ignoreInitial: true });
watcher
  .on('add', async (file) => {
    if (!file.endsWith('.js')) return;
    const rel = file.replace(__dirname, '');
    try {
      const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
      global.plugins[rel] = mod.default || mod;
      console.log(chalk.yellow(`[Plugin Add] ${rel}`));
    } catch (e) { console.error(chalk.red(`[Plugin Add Error] ${rel}`), e.message); }
  })
  .on('change', async (file) => {
    if (!file.endsWith('.js')) return;
    const rel = file.replace(__dirname, '');
    try {
      const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
      global.plugins[rel] = mod.default || mod;
      console.log(chalk.yellow(`[Plugin Change] ${rel}`));
    } catch (e) { console.error(chalk.red(`[Plugin Change Error] ${rel}`), e.message); }
  })
  .on('unlink', (file) => {
    const rel = file.replace(__dirname, '');
    delete global.plugins[rel];
    console.log(chalk.yellow(`[Plugin Remove] ${rel}`));
  });

/*──────────────────────────────────────
  Connect
──────────────────────────────────────*/
const authFolder = path.join(__dirname, 'session');
fs.mkdirSync(authFolder, { recursive: true });
fs.mkdirSync(path.join(__dirname, 'tmp'), { recursive: true });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version }          = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();

  global.conn = makeWASocket({
    version,
    logger: pino({ level: 'fatal' }),
    printQRInTerminal: !global.isPairing,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
    },
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    defaultQueryTimeoutMs: undefined,
    getMessage: async (key) => {
      const msg = await global.store.loadMessage(key.remoteJid, key.id);
      return msg?.message || { conversation: 'ayanaMD' };
    },
  });

  global.store.bind(global.conn.ev);
  bindConnMethods(global.conn, global.store);

  // Pairing code
  if (global.isPairing && !global.conn.authState.creds.registered) {
    console.log('\n' + chalk.cyan.bold('══════════════════════════════'));
    console.log(chalk.yellow.bold('  ayanaMD by KennDev'));
    console.log(chalk.cyan.bold('══════════════════════════════\n'));

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (q) => new Promise((res) => rl.question(q, res));
    const phone = await question(chalk.green('Masukkan nomor WA (contoh: 62895xxx): '));
    rl.close();

    try {
      const code = await global.conn.requestPairingCode(phone.trim());
      console.log(chalk.green.bold(`\n  Pairing Code: `) + chalk.yellow.bold(code) + '\n');
    } catch (e) {
      console.error(chalk.red('Gagal minta pairing code:'), e.message);
    }
  }

  // Register events
  global.conn.ev.on('connection.update', connectionUpdate);
  global.conn.ev.on('creds.update', saveCreds);
  global.conn.ev.on('messages.upsert', (update) => handler.call(global.conn, update));
  global.conn.ev.on('group-participants.update', (update) => participantsUpdate.call(global.conn, update));
  global.conn.ev.on('contacts.update', (updates) => {
    for (const c of updates) {
      const id = jidNormalizedUser(c.id);
      if (global.store?.contacts) global.store.contacts[id] = { ...(global.store.contacts[id] || {}), ...c };
    }
  });
  global.conn.ev.on('contacts.upsert', (updates) => {
    for (const c of updates) {
      const id = jidNormalizedUser(c.id);
      if (global.store?.contacts) global.store.contacts[id] = { ...c, isContact: true };
    }
  });
  global.conn.ev.on('groups.update', (updates) => {
    for (const u of updates) {
      if (global.store?.groupMetadata?.[u.id])
        global.store.groupMetadata[u.id] = { ...(global.store.groupMetadata[u.id] || {}), ...u };
    }
  });
}

/*──────────────────────────────────────
  Connection update handler
──────────────────────────────────────*/
async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) global.conn.isInit = true;

  if (connection === 'open') {
    console.log(chalk.green.bold(`[ayanaMD] Terhubung sebagai: ${JSON.stringify(global.conn.user, null, 2)}`));
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    console.log(chalk.red(`[ayanaMD] Koneksi terputus. Reason: ${reason}`));

    const noRetry = [
      DisconnectReason.loggedOut,
      DisconnectReason.badSession,
      DisconnectReason.connectionReplaced,
    ];

    if (noRetry.includes(reason)) {
      console.log(chalk.red.bold('[ayanaMD] Tidak bisa reconnect. Hapus folder session dan restart.'));
      process.exit(1);
    } else {
      console.log(chalk.yellow('[ayanaMD] Reconnecting…'));
      setTimeout(() => startBot(), 3_000);
    }
  }
}

/*──────────────────────────────────────
  Start
──────────────────────────────────────*/
startBot().catch((e) => {
  console.error(chalk.red('[ayanaMD] Fatal error:'), e);
  process.exit(1);
});

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
