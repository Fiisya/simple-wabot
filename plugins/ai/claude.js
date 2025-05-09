//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/ai-groq


const axios = require('axios');

let handler = async (m, {
    text
}) => {
    if (!text) return m.reply('Mau Tanya Apa');
    try {
        let {
            data
        } = await axios.get(`https://www.abella.icu/claude-3.7?q=${encodeURIComponent(text)}`);
        m.reply(data?.status == 'success' ? data.data.result : 'Api Nya Lagi Error Cba Lagi Nanti');
    } catch {
        m.reply('Waduh, Error');
    }
};

handler.help = ['ai'];
handler.command = ['claude', 'ai', 'grok'];
handler.tags = ['ai']

module.exports = handler;