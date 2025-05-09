//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/translate


const axios = require('axios');
const defaultLang = 'id';

let handler = async (m, {
    args,
    usedPrefix,
    command
}) => {
    if (!args[0] && !m.quoted) {
        throw `Contoh penggunaan:\n${usedPrefix}${command} en halo apa kabar\n${usedPrefix}${command} id|hello how are you`;
    }

    let lang = args[0];
    let text = args.slice(1).join(' ');

    if ((args[0] || '').length !== 2) {
        lang = defaultLang;
        text = args.join(' ');
    }

    if (!text && m.quoted?.text) text = m.quoted.text;

    try {
        // Use spaces instead of %20 in URL
        const apiUrl = `https://api.alfixd.my.id/api/translate?text=${text.split(' ').join(' ')}&to=${lang}`;

        const {
            data
        } = await axios.get(apiUrl, {
            timeout: 8000
        });

        if (!data || data.status !== 200) {
            throw 'Gagal mendapatkan hasil terjemahan';
        }

        const resultMsg = `
🔠 *Hasil Terjemahan*

▸ *Teks Asli (${data.lang_from.toUpperCase()}):*
"${data.original_text}"

▸ *Terjemahan (${data.lang_to.toUpperCase()}):*
"${data.translated_text}"

⌚ *Waktu:* ${new Date().toLocaleTimeString()}
`.trim();

        await m.reply(resultMsg);

    } catch (error) {
        console.error('Error:', error);
        throw `Gagal menerjemahkan. Pastikan:\n1. Kode bahasa valid (contoh: en, id, ja)\n2. Teks tidak kosong\n3. Koneksi stabil`;
    }
};

handler.help = ['translate <lang> <teks>'];
handler.tags = ['tools'];
handler.command = /^(tr|translate|terjemah|terjemahkan)$/i;
handler.limit = true;

module.exports = handler;