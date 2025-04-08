const {
    tekateki
} = require("@bochilteam/scraper");
let timeout = 120000;

let handler = async (m, {
    conn,
    command,
    usedPrefix
}) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;
    if (id in conn.tekateki) {
        conn.reply(
            m.chat,
            "You Already have question to answer !",
            conn.tekateki[id][0],
        );
    }
    let src = await (
        await fetch(
            "https://raw.githubusercontent.com/qisyana/scrape/main/tekateki.json",
        )
    ).json();
    let json = src[Math.floor(Math.random() * src.length)];
    let caption = `*[ TEKA TEKI ]*
*• Timeout :* 60 seconds
*• Question :* ${json.pertanyaan}
*• Clue :* ${json.jawaban.replace(/[AIUEOaiueo]/g, "_")}

reply to this message to answer the question
type *\`nyerah\`* to surender`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        json,
        setTimeout(() => {
            if (conn.tekateki[id])
                conn.sendMessage(
                    id, {
                        text: `Game Over !!
You lose with reason : *[ Timeout ]*

• Answer : *[ ${json.jawaban} ]*`,
                    }, {
                        quoted: m
                    },
                );
            delete conn.tekateki[id];
        }, timeout),
    ];
};

handler.before = async (m, {
    conn
}) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;
    if (!m.text) return;
    if (m.isCommand) return;
    if (!conn.tekateki[id]) return;
    let json = await conn.tekateki[id][1];
    let reward = db.data.users[m.sender];
    if (
        m.text.toLowerCase() === "nyerah" ||
        m.text.toLowerCase() === "surender"
    ) {
        clearTimeout(await conn.tekateki[id][2]);
        conn.sendMessage(
            m.chat, {
                text: `Game Over !!
You lose with reason : *[ ${m.text} ]*

• Answer : *[ ${json.jawaban} ]*`,
            }, {
                quoted: await conn.tekateki[id][0]
            },
        );
        delete conn.tekateki[id];
    } else if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
        reward.money += parseInt(10000);
        reward.limit += 10;
        clearTimeout(await conn.tekateki[id][2]);
        await conn.sendMessage(
            m.chat, {
                text: `Congratulations 🎉
you have successfully guessed the answer!

* *Money :* 10.000+
* *Limit :* 10+

Next question...`,
            }, {
                quoted: await conn.tekateki[id][0]
            },
        );
        delete conn.tekateki[id];
        await conn.appendTextMessage(m, ".tekateki", m.chatUpdate);
    } else {
        conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key,
            },
        });
    }
};

handler.help = ["tekateki"];
handler.tags = ["game"];
handler.command = ["tekateki"];
handler.group = true;

module.exports = handler;