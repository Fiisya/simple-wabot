/*─────────────────────────────────────────
  lib/database.js – ayanaMD by KennDev
─────────────────────────────────────────*/

const isNumber = (x) => typeof x === 'number' && !isNaN(x);

export default function initDatabase(m) {
  /* ── USER ── */
  if (typeof global.db.data.users[m.sender] !== 'object')
    global.db.data.users[m.sender] = {};

  const user = global.db.data.users[m.sender];
  if (!isNumber(user.exp))          user.exp          = 0;
  if (!isNumber(user.limit))        user.limit         = 100;
  if (!isNumber(user.saldo))        user.saldo         = 1000;
  if (!isNumber(user.money))        user.money         = 100000;
  if (!isNumber(user.bank))         user.bank          = 100000;
  if (!isNumber(user.lastclaim))    user.lastclaim     = 0;
  if (!isNumber(user.afk))          user.afk           = -1;
  if (!('afkReason'   in user))     user.afkReason     = '';
  if (!('registered'  in user))     user.registered    = false;
  if (!('name'        in user))     user.name          = m.name;
  if (!isNumber(user.age))          user.age           = -1;
  if (!isNumber(user.regTime))      user.regTime       = -1;
  if (!('banned'      in user))     user.banned        = false;
  if (!('online'      in user))     user.online        = false;
  if (!('premium'     in user))     user.premium       = false;
  if (!('premiumDate' in user))     user.premiumDate   = '';
  if (!('moderator'   in user))     user.moderator     = false;
  if (!isNumber(user.warn))         user.warn          = 0;
  if (!isNumber(user.chat))         user.chat          = 0;
  if (!isNumber(user.level))        user.level         = 1;
  if (!isNumber(user.joinlimit))    user.joinlimit     = 1;

  /* ── CHAT ── */
  if (typeof global.db.data.chats[m.chat] !== 'object')
    global.db.data.chats[m.chat] = {};

  const chat = global.db.data.chats[m.chat];
  if (!('isBanned'  in chat))  chat.isBanned   = false;
  if (!('mute'      in chat))  chat.mute        = false;
  if (!('welcome'   in chat))  chat.welcome     = false;
  if (!('detect'    in chat))  chat.detect      = false;
  if (!('sWelcome'  in chat))  chat.sWelcome    = '';
  if (!('sBye'      in chat))  chat.sBye        = '';
  if (!('sPromote'  in chat))  chat.sPromote    = '';
  if (!('sDemote'   in chat))  chat.sDemote     = '';
  if (!('antilink'  in chat))  chat.antilink    = false;
  if (!('antispam'  in chat))  chat.antispam    = false;
  if (!('antibot'   in chat))  chat.antibot     = false;
  if (!('whitelist' in chat))  chat.whitelist   = false;
  if (!isNumber(chat.chat))    chat.chat        = 0;
}
