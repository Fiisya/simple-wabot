let timeout = 120000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {};
  let id = m.chat;
  if (id in conn.tebakgambar) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebakgambar[id][0],
    );
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK GAMBAR ]*
*• Timeout :* 60 seconds
*• Clue :* ${json.jawaban.replace(/[AIUEOaiueo]/g, "_")}

Reply to this message to answer the question
Type *\`nyerah\`* to surrender`.trim();

  conn.tebakgambar[id] = [
    conn.sendFile(m.chat, json.img, null, caption, m),
    json,
    setTimeout(() => {
      if (conn.tebakgambar[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.jawaban} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebakgambar[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebakgambar[id]) return;
  let json = await conn.tebakgambar[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebakgambar[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.jawaban} ]*`,
      },
      { quoted: await conn.tebakgambar[id][0] },
    );
    delete conn.tebakgambar[id];
  } else if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebakgambar[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebakgambar[id][0] },
    );
    delete conn.tebakgambar[id];
    await conn.appendTextMessage(m, ".tebakgambar", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebakgambar"];
handler.tags = ["game"];
handler.command = ["tebakgambar"];
handler.group = true;

module.exports = handler;
