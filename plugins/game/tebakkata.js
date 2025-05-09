const { tebakkata } = require("@bochilteam/scraper");

let timeout = 120000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakkata = conn.tebakkata ? conn.tebakkata : {};
  let id = m.chat;
  if (id in conn.tebakkata) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebakkata[id][0],
    );
  }
  let json = await tebakkata();
  let caption = `*[ TEBAK KATA  ]*
*• Timeout :* 60 seconds
*• Question :* ${json.soal}
*• Clue :* ${json.jawaban.replace(/[AIUEOaiueo]/g, "_")}

reply to this message to answer the question
type *\`nyerah\`* to surender`.trim();

  conn.tebakkata[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    setTimeout(() => {
      if (conn.tebakkata[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.jawaban} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebakkata[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebakkata = conn.tebakkata ? conn.tebakkata : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebakkata[id]) return;
  let json = await conn.tebakkata[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebakkata[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.jawaban} ]*`,
      },
      { quoted: await conn.tebakkata[id][0] },
    );
    delete conn.tebakkata[id];
  } else if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebakkata[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebakkata[id][0] },
    );
    delete conn.tebakkata[id];
    await conn.appendTextMessage(m, ".tebakkata", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebakkata"];
handler.tags = ["game"];
handler.command = ["tebakkata"];
handler.group = true;

module.exports = handler;
