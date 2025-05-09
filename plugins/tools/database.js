const { proto } = require("baileys");
const handler = async (m, { conn, text, command, usedPrefix }) => {
  db.data.msg = db.data.msg ? db.data.msg : {};
  let M = proto.WebMessageInfo;
  if (!m.quoted) {
    throw `*• Example :* ${usedPrefix + command}`;
  } else if (!text) {
    throw `*• Example :* ${usedPrefix + command} *[input text]*`;
  }
  let msgs = db.data.msg;
  if (text in msgs) {
    throw `'${text}' already added !`;
  }
  msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON();
  m.reply(`Sucess Added Message : *[ ${text} ]*`.trim());
};
handler.help = ["vn", "msg", "video", "audio", "img", "stiker", "gif"].map(
  (v) => "add" + v + " *[input text]*",
);
handler.tags = ["tools"];
handler.command = /^add(vn|msg|video|audio|img|stic?ker|gif)$/;

module.exports = handler;
