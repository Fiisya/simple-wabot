let timeout = 120000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {};
  let id = m.chat;
  if (id in conn.tebaklirik) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebaklirik[id][0],
    );
  }
  let res = await fetch(
    "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json",
  );
  let data = await res.json();
  let json = data[Math.floor(Math.random() * data.length)];
  let caption = `*[ TEBAK LIRIK ]*
*• Timeout :* 60 seconds
*• Question :* ${json.soal}
*• Clue :* ${json.jawaban.replace(/[AIUEOaiueo]/g, "_")}

reply to this message to answer the question
type *\`nyerah\`* to surender`.trim();

  conn.tebaklirik[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    setTimeout(() => {
      if (conn.tebaklirik[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.jawaban} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebaklirik[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebaklirik[id]) return;
  let json = await conn.tebaklirik[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebaklirik[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.jawaban} ]*`,
      },
      { quoted: await conn.tebaklirik[id][0] },
    );
    delete conn.tebaklirik[id];
  } else if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebaklirik[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebaklirik[id][0] },
    );
    delete conn.tebaklirik[id];
    await conn.appendTextMessage(m, ".tebaklirik", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebaklirik"];
handler.tags = ["game"];
handler.command = ["tebaklirik"];
handler.group = true;

module.exports = handler;
