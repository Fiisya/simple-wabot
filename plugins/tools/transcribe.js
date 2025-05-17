//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/tools-transcribe


/*
Jangan Hapus Wm Bang 

*Summary & Transcript YouTube  Plugins Esm*

Ya Intinya Membuat Kesimpulan Dari Video 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J/1446
*/

const axios = require('axios');

async function transcribe(url) {
    try {
        let res = await axios.get('https://yts.kooska.xyz/', {
            params: {
                url: url
            },
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://kooska.xyz/'
            }
        }).then(i => i.data)
        return {
            status: true,
            video_id: res.video_id,
            summarize: res.ai_response,
            transcript: res.transcript
        }
    } catch (e) {
        return {
            status: false,
            msg: `Gagal mendapatkan respon, dengan pesan: ${e.message}`
        }
    }
}

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`*Cara Penggunaan:*\n${usedPrefix + command} <url video>\n\n*Contoh:*\n${usedPrefix + command} https://youtu.be/xxxxxxxxxxx`);
    }

    try {
        m.reply('*Membuat Ringkasan Dan Transkrip...*');

        const result = await transcribe(text);

        if (!result.status) {
            return m.reply(`*Error:* ${result.msg}`);
        }

        let resultMessage = `*Youtube Transcription And Summary*\n\n`;
        resultMessage += `*Summary Ai :*\n${result.summarize}\n\n`;
        resultMessage += `*Full Transcription:*\n${result.transcript}`;

        m.reply(resultMessage);

    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
    }
}

handler.help = ['transcribe'];
handler.tags = ['tools']
handler.command = /^(transcribe|transkripsi)$/i;
handler.limit = false;

module.exports = handler;