let timeout = 120000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
  let id = m.chat;
  if (id in conn.tebaklagu) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebaklagu[id][0],
    );
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/qisyana/scrape/main/tebaklagu.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)]
  let json = Apps;
  let caption = `*[ TEBAK LAGU ]*
*• Timeout :* 60 seconds
*• Artist :* ${json.artis}
*• Clue :* ${json.judul.replace(/[AIUEOaiueo]/g, "_")}

Reply to this message to answer the question
Type *\`nyerah\`* to surrender`.trim();
let q = await conn.reply(m.chat, caption, m)
  conn.tebaklagu[id] = [
    conn.sendFile(m.chat, json.lagu, null, caption, q),
    json,
    setTimeout(() => {
      if (conn.tebaklagu[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.judul} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebaklagu[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebaklagu[id]) return;
  let json = await conn.tebaklagu[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebaklagu[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.judul} ]*`,
      },
      { quoted: await conn.tebaklagu[id][0] },
    );
    delete conn.tebaklagu[id];
  } else if (m.text.toLowerCase() === json.judul.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebaklagu[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebaklagu[id][0] },
    );
    delete conn.tebaklagu[id];
    await conn.appendTextMessage(m, ".tebaklagu", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebaklagu"];
handler.tags = ["game"];
handler.command = ["tebaklagu"];
handler.group = true;

module.exports = handler;

