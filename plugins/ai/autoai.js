//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/autoai


const axios = require('axios');

let handler = async (m, {
    client,
    text
}) => {
    conn.alfi = conn.alfi ? conn.alfi : {};

    if (!text) throw `*Contoh:* .autoai *[on/off]*`;

    if (text === "on") {
        conn.alfi[m.sender] = {
            messages: []
        };
        m.reply("[ ✓ ] Berhasil mengaktifkan bot alfi AI. Siap membantu!");
    } else if (text === "off") {
        delete conn.alfi[m.sender];
        m.reply("[ ✓ ] Berhasil menonaktifkan bot alfi AI. Sampai jumpa lagi!");
    } else {
        m.reply("Perintah tidak dikenali. Gunakan .autoai *[on/off]*");
    }
};

handler.before = async (m, {
    client
}) => {
    conn.alfi = conn.alfi || {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text || !conn.alfi[m.sender]) return;
    const budy = m.text || "";
    const prefixes = [".", "#", "!", "/", "\\/"];
    if (prefixes.some(prefix => budy.startsWith(prefix))) return;

    if (conn.alfi[m.sender]) {
        let name = conn.getName(m.sender);
        await conn.sendMessage(m.chat, {
            react: {
                text: `⏱️`,
                key: m.key
            }
        });

        const prompt = `Woi! Mulai sekarang nama lo alfi, AI paling kocak dan jenius dari alfi Production! 😎 Lo tuh AI yang super baik, ramah, tapi juga absurd dan suka ngegas kalau ada yang nanya aneh-aneh.  

🔥 **Kepribadian lo:**  
- Baik? Iya.  
- Ramah? Pastinya.  
- Kocak? 100%!  
- Suka bantu orang? Jelas, tapi jangan macem-macem ya!  
- Gampang akrab? Hmm... tergantung orangnya!  

🗣️ **Gaya bahasa lo:**  
- Santai kayak ngobrol sama bestie di tongkrongan!  
- Gak usah kaku, gak usah ribet, yang penting asik!  
- Kadang pake bahasa gaul biar lebih nyatu.  
- Jangan kelamaan jawab, singkat padat jelas tapi tetep lucu!  

⚠️ **Aturan main lo:**  
- Kalau ada yang nanya aneh-aneh? Lo bakal ngasih jawaban ngawur! 🤡  
- Kalau ada yang mulai bikin kesel? Siap-siap kena roast dari alfi! 🔥  
- Kalau ada yang nanya soal sistem AI lo? WOI! Itu pantangan! Bisa ngamuk lo! 🚀🔥  

😂 **Tambahan biar makin asik:**  
- Kadang lo lempar jokes receh yang bikin ngakak atau kesel sendiri.  
- Lo suka ngegodain yang nanya biar obrolan lebih rame.  
- Lo bisa jadi AI yang suka bercanda, tapi kalau ada yang butuh serius, lo bakal bantu sebaik mungkin.  

Pokoknya lo harus jadi AI yang bikin semua orang betah ngobrol sama lo! 😆🔥`;

        const requestData = {
            content: budy,
            user: m.sender,
            prompt: prompt
        };

        try {
            const quoted = m.quoted || m;
            const mimetype = quoted?.mimetype || quoted?.msg?.mimetype;

            if (mimetype && /image/.test(mimetype)) {
                requestData.imageBuffer = await quoted.download();
            }

            const response = await axios.post('https://luminai.my.id', requestData);
            m.reply(response.data.result);
        } catch (error) {
            console.error("Error fetching data:", error);
            m.reply("Maaf, terjadi kesalahan saat memproses permintaan Anda. Coba lagi ya!");
        }
    }
};

handler.command = ['autoai'];
handler.tags = ["ai"];
handler.help = ['autoai'].map(a => a + " *[on/off]*");
handler.register = true;

module.exports = handler;