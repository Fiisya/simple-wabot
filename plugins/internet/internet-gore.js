let handler = async (m, { conn, text, usedPrefix, command }) => {
  m.reply(wait);
  try {
    let a = await Scraper["Api"].gore();
    let cap = `*[ RANDOM GORE ]*
• *Caption :* ${a.title}
• *Source :* ${a.source}
• *Tag :* ${a.tag}
• *Upload :* ${a.upload}`;
    conn.sendButton(m.chat, [["NEXT GORE", usedPrefix + command]], m, {
      body: cap,
      footer: "\n*® Next For More Gore*",
      url: a.video2,
    });
  } catch (e) {
    throw eror;
  }
};
handler.help = ["gore"].map((a) => a + " *[random gore]*");
handler.tags = ["internet"];
handler.command = ["gore"];

module.exports = handler;
