//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/pin


const axios = require("axios");

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) throw 'Masukin dulu dong kata kunci buat nyari gambarnya~';

    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });

        const res = await axios.get(`https://api.alfixd.my.id/api/pinterest?q=${encodeURIComponent(text)}`);
        const data = res.data;

        if (!data || !data.results || data.results.length === 0) throw 'Ga nemu cuy, coba kata lain~';

        const randomResult = data.results[Math.floor(Math.random() * data.results.length)];
        const image = randomResult.image;

        await conn.sendFile(m.chat, image, 'pinterest.jpg', `✨ Nih hasil nyari *"${text}"* bro~`, m);
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });

    } catch (e) {
        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        });
        conn.reply(m.chat, `*Yah error bro:* ${e.message || e}`, m);
    }
};

handler.command = handler.help = ['pinterest'];
handler.tags = ['internet'];
handler.limit = true;

module.exports = handler;