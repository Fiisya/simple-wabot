(async () => {
    require("./config");
    const { Lib, Store } = require("akiraa-scrape");
    const {
        default: makeWASocket,
        useMultiFileAuthState,
        makeInMemoryStore,
        makeCacheableSignalKeyStore,
        DisconnectReason,
        fetchLatestBaileysVersion,
        PHONENUMBER_MCC,
        Browsers,
        proto,
        jidNormalizedUser,
    } = require("baileys");
    const WebSocket = require("ws");
    const path = require("path");
    const p = require("pino");
    const pino = require("pino");
    const Pino = require("pino");
    const { Boom } = require("@hapi/boom");
    const fs = require("fs");
    const CFonts = require('cfonts');
    const chokidar = require("chokidar");
    const readline = require("readline");
    const NodeCache = require("node-cache");
    const yargs = require("yargs/yargs");
    const cp = require("child_process");
    const { promisify, format } = require("util");
    const exec = promisify(cp.exec).bind(cp);
    const _ = require("lodash");
    const syntaxerror = require("syntax-error");
    const os = require("os");
    const simple = require("./lib/simple.js");
    const { randomBytes } = require("crypto");
    const moment = require("moment-timezone");
    const chalk = require("chalk");
    const readdir = promisify(fs.readdir)
    const stat = promisify(fs.stat)
    const randomID = (length) =>
    randomBytes(Math.ceil(length * 0.5))
      .toString("hex")
      .slice(0, length);
    
   global.opts = new Object(
    yargs(process.argv.slice(2)).exitProcess(false).parse(),
  );
  global.prefix = new RegExp(
    "^[" +
      (
        opts["prefix"] ||
        "â€ŽxzXZ/i!#$%+Â£Â¢â‚¬Â¥^Â°=Â¶âˆ†Ã—Ã·Ï€âˆšâœ“Â©Â®:;?&.\\-"
      ).replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") +
      "]",
  );
async function load(module) {
	var module_ = await import(`${module}?id=${Date.now()}`)
	var result = module_ && 'default' in module_ ? module_.default : module_
	return result
}

const dbFilePath = path.join(__dirname, 'database.json'); 
const defaultDatabase = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
  settings: {},
  respon: {},
};

global.db = {
  READ: false, 
  data: null,  
  async read() {
     try {
      const data = fs.readFileSync(dbFilePath, 'utf-8');
      this.data = JSON.parse(data); 
    } catch (error) {
      this.data = null
    }
  },
  async write(data) {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2)); 
    } catch (error) {
      console.error('Error writing database file:', error);
    }
  }
};

global.loadDatabase = async() => {
  if (!db.READ) {
    setInterval(async () => {
      await db.write(db.data || {});
    }, 2000);
    db.READ = true;
  }
  if (db.data !== null) return;
  db.READ = true;
  await db.read();
  if (db.data === null) {
    console.warn('Initializing database with default values.');
    db.data = defaultDatabase;
  }
  db.READ = false;
  db.data = {
    ...defaultDatabase,
    ...(db.data || {}),
  };
  db.chain = _.chain(db.data);
};
 loadDatabase();
  global.store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
  
    global.authFolder = `session`;
      
   const logger = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` }).child({ class: 'Nazir' });
      logger.level = 'fatal';
   
    global.store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
    
  function createTmpFolder() {
  const folderName = "tmp";
const folderPath = path.join(__dirname, folderName);
if (!fs.existsSync(folderPath)) {
fs.mkdirSync(folderPath);
    }
}
createTmpFolder();
    const {
        state,
        saveState,
        saveCreds
    } = await useMultiFileAuthState(authFolder);
    const msgRetryCounterMap = (MessageRetryMap) => {};
    const msgRetryCounterCache = new NodeCache();;
    const {
        version
    } = await fetchLatestBaileysVersion();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const question = (texto) =>
        new Promise((resolver) => rl.question(texto, resolver));
        
    store.readFromFile(process.cwd()+`/${global.authFolder}/store.json`)
    
    const connectionOptions = {
        logger: pino({
            level: "silent",
        }),
        printQRInTerminal: !isPairing,
        browser: Browsers.windows("Edge"),
        patchMessageBeforeSending: (message) => {
            const requiresPatch = (
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({
                    level: "fatal",
                }).child({
                    level: "fatal",
                }),
            ),
        },
        markOnlineOnConnect: true, // set false for offline
        generateHighQualityLinkPreview: true, // make high preview link
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg.message || undefined;
            }
            return {
                conversation: "Asyl-Botz",
            };
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    };
    global.conn = simple.makeWASocket(connectionOptions);
    store.bind(conn.ev);

    if (isPairing && !conn.authState.creds.registered) {
     CFonts.say('WELCOME', {
   font: 'tiny',
   align: 'center',
}), CFonts.say('Powered By Asyl', {
   colors: ['system'],
   font: 'console',
   align: 'center',
});
console.log(chalk.white.bold(`Operating System Information:
- Platform: ${os.platform()}
- Release: ${os.release()}
- Architecture: ${os.arch()}
- Hostname: ${os.hostname()}
- Total Memory: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
- Free Memory: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
- Uptime: ${os.uptime()} seconds`));
        console.log(chalk.red.bold("[ ! ]") + chalk.cyan.bold(` Please enter your WhatsApp number, for example +628xxxx\n`) );
        const phoneNumber = await question(
            chalk.green.bold(chalk.green.bold("Your Number : ")),
        );
        const code = await conn.requestPairingCode(phoneNumber);
      console.log(
        `${chalk.green.bold("- Your Paring Code : ")} ${chalk.yellow.bold(code)}\n\n`,
      );
    }
    async function connectionUpdate(update) {
        const {
            connection,
            lastDisconnect,
            isNewLogin
        } = update;
        global.stopped = connection;
        if (isNewLogin) conn.isInit = true;
        if (update.qr != 0 && update.qr != undefined) {}
        if (connection == "open") {
            console.log(
                chalk.yellow.bold(
                    `[ Success ] Success connect to : ${JSON.stringify(conn.user, null, 2)}`,
                ),
            );
        }
        let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (connection === "close") {
            if (reason === DisconnectReason.badSession) {
                conn.logger.error(
                    `Bad Sessions !,  delete ${global.authFolder} and connect again`,
                );
                console.log(reloadHandler(true));
            } else if (reason === DisconnectReason.connectionClosed) {
                conn.logger.warn(`Connection closed, reconnect...`);
                console.log(reloadHandler(true));
            } else if (reason === DisconnectReason.connectionLost) {
                conn.logger.warn(`Connection lost`);
                console.log(reloadHandler(true));
            } else if (reason === DisconnectReason.connectionReplaced) {
                conn.logger.error(
                    `Connection replace`,
                );
                console.log(reloadHandler(true));
            } else if (reason === DisconnectReason.loggedOut) {
                conn.logger.error(
                    `Connection Logout, please delete & create your sessions`,
                );
                console.log(reloadHandler(true));
            } else if (reason === DisconnectReason.restartRequired) {
                conn.logger.info(
                    `Reastart required, plese wait...`,
                );
                console.log(reloadHandler(true));
            } else if (reason === DisconnectReason.timedOut) {
                conn.logger.warn(`Connection Timeout`);
                console.log(reloadHandler(true));
            } else {
                conn.logger.warn(
                    `Connection close ${reason || ""}: ${connection || ""}`,
                );
                console.log(reloadHandler(true));
            }
        }
    }
    process.on("uncaughtException", console.error);
    let isInit = true,
        handler = require("./handler");
    reloadHandler = function(restatConn) {
        let Handler = require("./handler");
        if (Object.keys(Handler || {}).length) handler = Handler;
        if (restatConn) {
            try {
                conn.ws.close();
            } catch {}
            conn = {
                ...conn,
                ...simple.makeWASocket(connectionOptions),
            };
        }
        if (!isInit) {
            conn.ev.off("messages.upsert", conn.handler);
            conn.ev.off("group-participants.update", conn.onParticipantsUpdate);
            conn.ev.off("connection.update", conn.connectionUpdate);
            conn.ev.off("creds.update", conn.credsUpdate);
        }

        conn.welcome =
            "Welcome to *@subject* @user\nSemoga betah Dan jangan lupa baca deskripsi\n@desc";
        conn.bye = "Goodbye @user,\nSemoga tenang di alam sana.";
        conn.spromote = "@user telah naik jabatan";
        conn.sdemote = "@user telah turun jabatan🗿";
        conn.handler = handler.handler.bind(conn);
        conn.onParticipantsUpdate = handler.participantsUpdate.bind(conn);
        conn.connectionUpdate = connectionUpdate.bind(conn);
        conn.credsUpdate = saveCreds.bind(conn);

        conn.ev.on("messages.upsert", conn.handler);
        conn.ev.on("group-participants.update", conn.onParticipantsUpdate);
        conn.ev.on("connection.update", conn.connectionUpdate);
        conn.ev.on("creds.update", conn.credsUpdate);
        conn.ev.on('contacts.update', update => {
		for (let contact of update) {
			let id = jidNormalizedUser(contact.id);
			if (store && store.contacts) store.contacts[id] = { ...(store.contacts?.[id] || {}), ...(contact || {}) };
		}
	});
	conn.ev.on('contacts.upsert', update => {
		for (let contact of update) {
			let id = jidNormalizedUser(contact.id);
			if (store && store.contacts) store.contacts[id] = { ...(contact || {}), isContact: true };
		}
	});
     conn.ev.on('groups.update', updates => {
		for (const update of updates) {
			const id = update.id;
			if (store.groupMetadata[id]) {
				store.groupMetadata[id] = { ...(store.groupMetadata[id] || {}), ...(update || {}) };
			}
		}
	});	
       isInit = false;
        return true;
    };
    global.plugins = {};

    let Scandir = async (dir) => {
        let subdirs = await readdir(dir);
        let files = await Promise.all(subdirs.map(async (subdir) => {
            let res = path.resolve(dir, subdir);
            return (await stat(res)).isDirectory() ? Scandir(res) : res;
        }));
        return files.reduce((a, f) => a.concat(f), []);
    };
    try {
        let files = await Scandir("./plugins");
        let plugins = {};
        for (let filename of files.map(a => a.replace(process.cwd(), ""))) {
            try {
                plugins[filename] = require(path.join(process.cwd(), filename));
            } catch (e) {
                console.log(chalk.red.bold(e));
                delete plugins[filename];
            }
        }
    const watcher = chokidar.watch(path.resolve("./plugins"), {
            persistent: true,
            ignoreInitial: true
        });
        watcher
            .on('add', async(filename) => {
         console.log(chalk.yellow.bold("[ New ] Detected New Plugins : " + filename.replace(process.cwd(), "")))
         plugins[filename.replace(process.cwd(), "")] = require(filename);      
      }).on('change', async(filename) => {
         if (require.cache[filename] && require.cache[filename].id === filename) {
             plugins[filename.replace(process.cwd(), "")] = require.cache[filename].exports
             console.log(chalk.yellow.bold("[ Change ] Changes code in Plugins : "+ filename.replace(process.cwd(), "")))   
              delete require.cache[filename];
                 }
           let err = syntaxerror(fs.readFileSync(filename), filename.replace(process.cwd(), ""))
			if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`)
          plugins[filename.replace(process.cwd(), "")] = require(filename);
           }).on('unlink', (filename) => {
          console.log(chalk.yellow.bold("[ Delete ] Suucess Delete : "+ filename.replace(process.cwd(), "")))
           delete plugins[filename.replace(process.cwd(), "")]
        });
    plugins = Object.fromEntries(Object.entries(plugins).sort(([a], [b]) => a.localeCompare(b)));   
        global.plugins = plugins;
        console.log(chalk.blue.bold(`[ Success ] Success Load ${Object.keys(plugins).length} plugins`));       
    } catch (e) {
        console.error(e);
    }  
 setInterval(async () => {
		if (store.contacts) 
       fs.writeFileSync(process.cwd()+`/${global.authFolder}/store-contacts.json`, JSON.stringify(store.contacts));
 store.writeToFile(process.cwd()+`/${global.authFolder}/store.json`);
  
	}, 10 * 1000); 
	
 reloadHandler()
  })();

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}