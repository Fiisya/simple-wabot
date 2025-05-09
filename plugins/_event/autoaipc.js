//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : _event/autoaipc


const axios = require('axios');

module.exports = {
    name: 'ai-auto-mention',
    async before(m, {
        conn
    }) {
        const text = m.text || '';
        if (!text) return;

        const isMentioned = m.mentionedJid?.includes(conn.user.jid) || /@(?:yoru|ai|yoru ai)/i.test(text);
        const isPrivate = !m.isGroup;

        // Jalankan hanya jika di private chat ATAU disebut di grup
        if (!isPrivate && !isMentioned) return;

        // Skip jika pakai prefix
        const prefixRegex = /^[°zZ#$+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/;
        const prefix = prefixRegex.test(text) ? text.match(prefixRegex)[0] : '.';
        if (text.startsWith(prefix)) return;

        const prompt = `Nama kamu adalah Fixxy Ai`;

        const requestData = {
            content: text,
            user: m.sender,
            prompt: prompt
        };

        if (m.quoted && /image/.test(m.quoted.mimetype || m.quoted.msg?.mimetype)) {
            try {
                const buffer = await m.quoted.download();
                requestData.imageBuffer = buffer.toString('base64');
            } catch (err) {
                console.error('Gagal unduh gambar:', err);
            }
        }

        try {
            const res = await axios.post('https://luminai.my.id', requestData);
            const reply = res.data.result;
            await conn.sendMessage(m.chat, {
                text: reply
            }, {
                quoted: m
            });
        } catch (err) {
            console.error('API Error:', err);
            await conn.sendMessage(m.chat, {
                text: `Maaf, terjadi kesalahan: ${err.message}`
            }, {
                quoted: m
            });
        }
    }
}