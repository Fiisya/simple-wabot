const {
  WAMessageStubType,
  generateWAMessage,
  areJidsSameUser,
  proto,
} = require("baileys");
const chalk = require("chalk");
const { tanggal } = require("./myfunc");
const moment = require("moment-timezone");

module.exports = async (m, conn = {}, chatUpdate) => {
  let type = m.isGroup ? "Group Chat" : "Private Chat";

  let from = await conn.getName(m.chat);
  let number = m.sender.split("@")[0] + ` || ${m.name}`;
  let isBot = m.isBaileys ? "Yes" : "No";
  let txt = m.text ? (m.text.length >= 30 ? m.text.slice(0, 29) + "..." : m.text) : "";
  let plugin = m.plugin;
  const log = chalk.white.bold;
  const headers = `${chalk.green.bold("Chat Information :")}`;

const body = `${log(`- Type : ${type}`)}
${log(`- Plugins : ${plugin}`)}
${log(`- Name : ${number}`)}
${log(`- Time : ${moment.tz("Asia/Makassar").format("DD/MM/YYYY HH:mm:ss")}`)}
${log(`- Mimetype : ${log(m.messageStubType ? WAMessageStubType[m.messageStubType] : m.mtype)}`)}`;

  console.log(`\n--------------------------------------\n${headers}\n${body}\n--------------------------------------\n${m.isCommand ? chalk.yellow.bold(txt) : txt}`);
 
  const chat = db.data.chats[m.chat];
  let detect = false;
  if (chat.antiBot) {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const participants = (m.isGroup ? groupMetadata.participants : []) || [];
    const user =
      (m.isGroup
        ? participants.find((u) => conn.decodeJid(u.id) === m.sender)
        : {}) || {}; // User Data
    const bot =
      (m.isGroup
        ? participants.find((u) => conn.decodeJid(u.id) == conn.user.jid)
        : {}) || {}; // Your Data
    const isRAdmin = user?.admin == "superadmin" || false;
    const isAdmin = isRAdmin || user?.admin == "admin" || false; // Is User Admin?
    const isBotAdmin = bot?.admin || false; // Are you Admin?

    if (m.isBaileys && !m.fromMe) {
      if (isAdmin || !isBotAdmin) {
      } else {
        await conn.sendMessage(m.chat, {
          text: `*[ System notice ]* Detect anoher bot, I will kick you`,
        });
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
        detect = true;
      }
    }
  }
};

let fs = require("fs");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log("Update config.js");
  delete require.cache[file];
  require(file);
});
