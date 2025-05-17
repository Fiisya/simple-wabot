let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.sendButton(
    m.chat,
    [["UNREGISTER", `.unreg ${await db.data.users[m.sender].sn}`]],
    m,
    {
      body: "*Your ID :* " + db.data.users[m.sender].sn,
    },
  );
};
handler.help = ["cekid"].map((a) => a + " *[check ID user]*");
handler.tags = ["main"];
handler.command = ["cekid"];
handler.register = true;

module.exports = handler;
