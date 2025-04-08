let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*• Example :* ${usedPrefix + command} *[on/off]*`;
  if (text === "on") {
    opts["gconly"] = true;
    m.reply("Success Turn On : *[ Gconly Mode ]*");
  } else if (text === "off") {
    opts["gconly"] = false;
    m.reply("Success Turn Off : *[ Gconly Mode ]*");
  } else throw `*• Example :* ${usedPrefix + command} *[on/off]*`;
};
handler.help = ["gconly"].map((a) => a + " *[gconly mode]*");
handler.tags = ["owner"];
handler.command = ["gconly"];
handler.owner = true;

module.exports = handler;
