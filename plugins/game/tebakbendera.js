let timeout = 120000;
let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {};
  let id = m.chat;
  if (id in conn.tebakbendera) {
    conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini",
      conn.tebakbendera[id].reply,
    );
    throw false;
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/qisyana/scrape/main/flag.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK BENDERA ]*
*• Timeout :* 60 seconds
*• Question :* Bendera dari negara manakah ini?
*• Clue :*   ${json.name.replace(/[AIUEOaiueo]/gi, "_")}`.trim();
  let q = await conn.sendMessage(
    m.chat,
    { image: { url: json.img }, caption: caption },
    { quoted: m },
  );
  conn.tebakbendera[id] = {
    reply: q,
    ...json,
  };
  setTimeout(() => {
    if (conn.tebakbendera[id]) {
      conn.reply(
        m.chat,
        `*</> T I M E O U T </>*\n*• Jawaban :* ${json.name}`,
        q,
      );
      delete conn.tebakbendera[id];
    }
  }, timeout);
};
handler.before = async (m, { conn }) => {
  conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {};
  let id = m.chat;
  if (m.isCommand) return;
  if (!conn.tebakbendera[id]) return;
  let json = await conn.tebakbendera[id];
  let reward = db.data.users[m.sender];
  if (m.text.toLowerCase() === json.name.toLowerCase()) {
    reward.money += parseInt(10000);
    conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward !",
      author: "+1000 money",
    });
    delete conn.tebakbendera[id];
  } else
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
};
handler.help = ["tebakbendera"];
handler.tags = ["game"];
handler.command = /^tebakbendera/i;
handler.group = false;

module.exports = handler;
