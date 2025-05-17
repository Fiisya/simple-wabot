//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/llama


const fetch = require('node-fetch');

let handler = async (m, {
    text,
    command,
    conn
}) => {
    if (!text) return m.reply('Silakan masukkan pertanyaan');

    let apiUrl = `https://api.alfixd.my.id/api/llama-3.3-70b-versatile?content=${encodeURIComponent(text)}`;

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

        if (json.status) {
            m.reply(json.response);
        } else {
            m.reply('Maaf, terjadi kesalahan Coba lagi nanti!');
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan dalam menghubungi API.');
    }
};


handler.help = ["llama"];
handler.tags = ["ai"];
handler.command = /^llama$/i;
handler.limit = true

module.exports = handler;