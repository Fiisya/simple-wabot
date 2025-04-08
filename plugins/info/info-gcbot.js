let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.sendCopy(m.chat, [["copy link !", `https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP`]], m, {
    body: `Join to official group to get more Information : *[ https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP ]*`,
  });
  conn.groupMetadata = async (jid) => {
    return store.groupMetadata[jid];
  };
};
handler.help = ["gcbot"].map((a) => a + " *[official group bot]*");
handler.tags = ["info"];
handler.command = ["gcbot"];

module.exports = handler;
