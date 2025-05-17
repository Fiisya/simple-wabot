let timeout = 120000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.chat;
  if (id in conn.tebakgame) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebakgame[id][0],
    );
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK GAME ]*
*• Timeout :* 60 seconds
*• Question :* Guess the game title based on the picture
*• Clue :* ${json.jawaban.replace(/[AIUEOaiueo]/g, "_")}

Reply to this message to answer the question
Type *\`nyerah\`* to surrender`.trim();

  conn.tebakgame[id] = [
    conn.sendFile(m.chat, json.img, null, caption, m),
    json,
    setTimeout(() => {
      if (conn.tebakgame[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.jawaban} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebakgame[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebakgame[id]) return;
  let json = await conn.tebakgame[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebakgame[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.jawaban} ]*`,
      },
      { quoted: await conn.tebakgame[id][0] },
    );
    delete conn.tebakgame[id];
  } else if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebakgame[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebakgame[id][0] },
    );
    delete conn.tebakgame[id];
    await conn.appendTextMessage(m, ".tebakgame", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebakgame"];
handler.tags = ["game"];
handler.command = ["tebakgame"];
handler.group = true;

module.exports = handler;
