let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.sendCopy(m.chat, [["copy link !", `https://chat.whatsapp.com/L5OUiV1WF5EJLU2fDjR62C`]], m, {
    body: `Join to official group to get more Information : *[ https://chat.whatsapp.com/L5OUiV1WF5EJLU2fDjR62C ]*`,
  });
  conn.groupMetadata = async (jid) => {
    return store.groupMetadata[jid];
  };
};
handler.help = ["gcbot"].map((a) => a + " *[official group bot]*");
handler.tags = ["info"];
handler.command = ["gcbot"];

module.exports = handler;
