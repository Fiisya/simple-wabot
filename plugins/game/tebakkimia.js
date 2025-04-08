const { tebakkimia } = require("@bochilteam/scraper");
let timeout = 120000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {};
  let id = m.chat;
  if (id in conn.tebakkimia) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebakkimia[id][0],
    );
  }
  let json = await tebakkimia();
  let caption = `*[ TEBAK KIMIA ]*
*• Timeout :* 60 seconds
*• Question :* ${json.unsur}
*• Clue :* ${json.jawaban.replace(/[AIUEOaiueo]/g, "_")}

reply to this message to answer the question
type *\`nyerah\`* to surender`.trim();

  conn.tebakkimia[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    setTimeout(() => {
      if (conn.tebakkimia[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.jawaban} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebaklogo[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebakkimia[id]) return;
  let json = await conn.tebakkimia[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebakkimia[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.jawaban} ]*`,
      },
      { quoted: await conn.tebakkimia[id][0] },
    );
    delete conn.tebakkimia[id];
  } else if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebakkimia[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebakkimia[id][0] },
    );
    delete conn.tebakkimia[id];
    await conn.appendTextMessage(m, ".tebakkimia", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebakkimia"];
handler.tags = ["game"];
handler.command = ["tebakkimia"];
handler.group = true;

module.exports = handler;
