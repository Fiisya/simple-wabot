//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/chatgpt




const fetch = require('node-fetch');

let handler = async (m, {
    text,
    command,
    conn
}) => {
    if (!text) return m.reply('Silakan masukkan pertanyaan');

    let apiUrl = `https://api.alfixd.my.id/api/gemini?text=${encodeURIComponent(text)}`;

    await conn.relayMessage(m.chat, {
        reactionMessage: {
            key: m.key,
            text: '⏱️'
        }
    }, {
        messageId: m.key.id
    });

    try {
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (json.sukses) {
            m.reply(json.jawaban);
        } else {
            m.reply('Maaf, terjadi kesalahan Coba lagi nanti!');
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan dalam menghubungi API.');
    }
};


handler.help = ["chatgpt"];
handler.tags = ["ai"];
handler.command = /^chatgpt$/i;
handler.limit = true

module.exports = handler;