let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.quoted)
    throw `*• Example :* ${usedPrefix + command} *[reply sticker]*`;
  if (!text) throw `*• Example :* ${usedPrefix + command} *[name command]*`;
  let { key } = await conn.sendMessage(m.chat, { text: wait }, { quoted: m });
  try {
    let hash = m.quoted.fileSha256.toString("base64");
    db.data.sticker[hash] = {
      message: text,
      creator: m.name,
      jid: m.sender,
      url: await Uploader.catbox(await m.quoted.download()),
    };
    await conn.sendMessage(
      m.chat,
      { text: "*[ SUCESS ADD COMMAND TO STICKER ]*", edit: key },
      { quoted: m },
    );
  } catch (e) {
    throw e;
  }
};
handler.help = ["setcmd"].map((a) => a + " *[premium only]*");
handler.tags = ["premium"];
handler.command = ["setcmd"];
handler.premium = true;

module.exports = handler;
