//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/tools-hd


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

async function handler(m, {
    conn,
    usedPrefix,
    command
}) {
    m.reply('⏳ Sedang memproses gambar, mohon tunggu...');
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || q.mediaType || '';

        if (!/^image\/(jpe?g|png)$/.test(mime)) {
            return m.reply(`Balas gambar dengan caption *${usedPrefix + command}* atau tag gambar yang ingin ditingkatkan (hanya JPG/PNG).`);
        }

        const img = await q.download();
        const rawUrl = await uploadImage(img);

        if (!rawUrl) return m.reply('Gagal mengunggah gambar ke server. Coba lagi nanti.');

        const apiUrl = `https://beta.anabot.my.id/api/ai/toEnhance?imageUrl=${encodeURIComponent(rawUrl)}&apikey=freeApikey`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (json.status !== 200 || !json.data?.result) {
            return m.reply('Gagal meningkatkan kualitas gambar. Coba lagi nanti.');
        }

        const enhancedImageUrl = json.data.result;
        const imageResponse = await fetch(enhancedImageUrl);
        const imageBuffer = await imageResponse.buffer();

        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: '✨ Gambar berhasil ditingkatkan kualitasnya!',
            mimetype: 'image/png'
        }, {
            quoted: m
        });

    } catch (err) {
        console.error('[Enhancer Handler] Error:', err);
        m.reply('Terjadi kesalahan saat memproses gambar.');
    }
}

handler.help = ["hd", "remini", "hdr"];
handler.tags = ["tools"];
handler.premium = false;
handler.limit = true;
handler.command = ["hd", "remini", "hdr"];

module.exports = handler;