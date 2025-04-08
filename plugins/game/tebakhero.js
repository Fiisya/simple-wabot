let timeout = 120000;
let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakhero = conn.tebakhero ? conn.tebakhero : {};
  let id = m.chat;
  if (id in conn.tebakhero) {
    conn.reply(
      m.chat,
      "You Already have question to answer !",
      conn.tebakhero[id][0],
    );
  }
  let json = await tebakhero("id")
  if (!json.voice) return
  let caption = `*[ TEBAK HEROML ]*
*• Timeout :* 60 seconds
*• Question :* Guess the ML Hero based on his character's voice
*• Clue :* ${json.hero.replace(/[AIUEOaiueo]/g, "_")}

Reply to this message to answer the question
Type *\`nyerah\`* to surrender`.trim();
let q = await conn.reply(m.chat, caption, m)
  conn.tebakhero[id] = [
    conn.sendFile(m.chat, json.voice, "ml.mp3", caption, q),
    json,
    setTimeout(() => {
      if (conn.tebakhero[id])
        conn.sendMessage(
          id,
          {
            text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.hero} ]*`,
          },
          { quoted: m },
        );
      delete conn.tebakhero[id];
    }, timeout),
  ];
};

handler.before = async (m, { conn }) => {
  conn.tebakhero = conn.tebakhero ? conn.tebakhero : {};
  let id = m.chat;
  if (!m.text) return;
  if (m.isCommand) return;
  if (!conn.tebakhero[id]) return;
  let json = await conn.tebakhero[id][1];
  let reward = db.data.users[m.sender];
  if (
    m.text.toLowerCase() === "nyerah" ||
    m.text.toLowerCase() === "surender"
  ) {
    clearTimeout(await conn.tebakhero[id][2]);
    conn.sendMessage(
      m.chat,
      {
        text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.hero} ]*`,
      },
      { quoted: await conn.tebakhero[id][0] },
    );
    delete conn.tebakhero[id];
  } else if (m.text.toLowerCase() === json.hero.toLowerCase()) {
    reward.money += parseInt(10000);
    reward.limit += 10;
    clearTimeout(await conn.tebakhero[id][2]);
    await conn.sendMessage(
      m.chat,
      {
        text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
      },
      { quoted: await conn.tebakhero[id][0] },
    );
    delete conn.tebakhero[id];
    await conn.appendTextMessage(m, ".tebakhero", m.chatUpdate);
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  }
};

handler.help = ["tebakhero"];
handler.tags = ["game"];
handler.command = ["tebakhero"];
handler.group = true;

module.exports = handler;

async function tebakhero(tema = "id") {
try {
     let karakter = ["Aamon", "Assassin", "Jungler", "Akai", "Tank", "Aldous", "Fighter", "Alice", "Alpha", "Alucard", "Angela", "Support", "Roamer", "Argus", "EXP Laner", "Arlott", "Atlas", "Aulus", "Aurora", "Mage", "Badang", "Balmond", "Bane", "Barats", "Baxia", "Beatrix", "Marksman", "Gold Laner", "Belerick", "Benedetta", "Brody", "Bruno", "Carmilla", "Caecilion", "Mid Laner", "Chou", "Figter", "Cici", "Claude", "Clint", "Cyclops", "Diggie", "Dyrroth", "Edith", "Esmeralda", "Estes", "Eudora", "Fanny", "Faramis", "Floryn", "Franco", "Fredrinn", "Freya", "Gatotkaca", "Gloo", "Gord", "Granger", "Grock", "Guinevere", "Gusion", "Hanabi", "Hanzo", "Harith", "Harley", "Hayabusa", "Helcurt", "Hilda", "Hylos", "Irithel", "Ixia", "Jawhead", "Johnson", "Joy", "Asassin", "Julian", "Kadita", "Kagura", "Kaja", "Karina", "Karrie", "Khaleed", "Khufra", "Kimmy", "Lancelot", "Layla", "Leomord", "Lesley", "Ling", "Lolita", "Lunox", "Luo Yi", "Lylia", "Martis", "Masha", "Mathilda", "Melissa", "Minotaur", "Minsitthar", "Miya", "Moskov", "Nana", "Natalia", "Natan", "Novaria", "Odette", "Paquito", "Pharsa", "Phoveus", "Popol and Kupa", "Rafaela", "Roger", "Ruby", "Saber", "Selena", "Silvanna", "Sun", "Terizla", "Thamuz", "Tigreal", "Uranus", "Vale", "Valentina", "Valir", "Vexana", "Wanwan", "Xavier", "Yin", "Yu Zhong", "Yve", "Zhask", "Zilong"];
   let chara = karakter[Math.floor(Math.random() * karakter.length)]
    const url = tema === "id" ? `https://mobile-legends.fandom.com/wiki/${chara.toLowerCase()}/Audio/id` : tema === "en" ? `https://mobilelegendsbuild.com/sitemap.xml` : null;
    if (!url) throw new Error("Tema tidak valid");
    let res = await fetch(url);
    let data = await res.text();
    if (tema === "en") {
      const result = await parseStringPromise(data);
      const targetUrl = result.urlset.url.filter(url => url.loc[0].includes("sound/" + chara.toLowerCase())).map(url => url.loc[0])[0];
      if (!targetUrl) return [];
      res = await fetch(targetUrl);
      data = await res.text();
    }
    const $ = cheerio.load(data);
    let audio = $("audio").map((i, el) => $(el).attr("src")).get();
   let audio_random = audio[Math.floor(Math.random() * audio.length)]
   if (!audio_random) await tebakhero()
 return {
  hero: chara,
  voice: audio_random || audio
   }
  } catch (error) {
    return error
  }
}