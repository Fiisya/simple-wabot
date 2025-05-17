//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/editimg


const axios = require('axios');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cheerio = require('cheerio');

async function alfixdRaw(fileBuffer) {
    try {
        const form = new FormData();
        form.append('file', fileBuffer, {
            filename: 'upload.jpg'
        });

        const response = await fetch('https://upfilegh.alfiisyll.biz.id/upload', {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const html = await response.text();
        const $ = cheerio.load(html);
        const rawUrl = $('#rawUrlLink').attr('href');

        if (!rawUrl) throw new Error('Gagal mengambil URL gambar mentah.');
        return rawUrl;
    } catch (error) {
        console.error('[alfixdRaw] Upload error:', error.message);
        return null;
    }
}

async function uploadImage(imageBuffer) {
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) throw new Error('Buffer gambar tidak valid.');
    return await alfixdRaw(imageBuffer);
}


let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw 'Masukkan teks yang ingin diproses!';

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/image/.test(mime) && !/webp/.test(mime)) {
        await conn.reply(m.chat, '⏳ Sedang diproses, harap tunggu...', m);

        try {
            const img = await q.download?.();
            if (!img) throw new Error("Gagal mendownload gambar.");

            const rawUrl = await uploadImage(img);

            if (!rawUrl) return m.reply('Gagal mengunggah gambar ke server. Coba lagi nanti.');

            let encodedText = encodeURIComponent(text);
            let resultUrl = `https://fastrestapis.fasturl.cloud/aiimage/gemini?prompt=${encodedText}&imageUrl=${rawUrl}`;

            console.log("🔗 URL API:", resultUrl);

            let response = await axios.get(resultUrl, {
                responseType: 'arraybuffer'
            });

            console.log("✅ API Response:", response.status);

            let buff = response.data;

            await conn.sendMessage(
                m.chat, {
                    image: buff,
                    caption: `✅ *Proses selesai!*\n\n📌 *Prompt:* ${text}`,
                }, {
                    quoted: m
                }
            );
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message || error);
            m.reply(`❌ Terjadi kesalahan: ${error.response?.data?.message || error.message || error}`);
        }
    } else {
        m.reply(`⚠️ Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};

handler.help = ['editimg'];
handler.tags = ['tools'];
handler.command = /^(geminiimage|editimg)$/i;
handler.register = true;
handler.limit = 2;

module.exports = handler;