const fetch = require('node-fetch');
const FormData = require('form-data');
const cheerio = require('cheerio');

async function before(m, { conn }) {
  const chat = global.db.data.chats[m.chat];
  if (!chat || !chat.autohd) return;

  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';

  if (/^image/.test(mime) && !/webp/.test(mime)) {
    try {
      const loading = await conn.sendMessage(m.chat, {
        text: '⏳ *AutoHD aktif... Memproses gambar.*',
        contextInfo: {
          externalAdReply: {
            title: 'Memperjelas Gambar...',
            body: 'AutoHD aktif oleh AlfiBot',
            thumbnailUrl: 'https://raw.githubusercontent.com/Fiisya/uploads/main/uploads/1746929845549.jpeg',
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: 'https://alfixd.my.id'
          }
        }
      }, { quoted: m });

      const img = await q.download();
      const out = await uploadImage(img);
      if (!out) return m.reply('❌ Gagal mengunggah gambar.');

      const apiURL = `https://fastrestapis.fasturl.cloud/aiimage/superscale?imageUrl=${encodeURIComponent(out)}&resize=8&anime=false`;
      const apiRes = await fetch(apiURL);
      const json = await apiRes.json();

      if (!json || json.status !== 200 || !json.result) {
        return m.reply('❌ Gagal memproses gambar dengan API baru.');
      }

      const resultBuffer = await fetch(json.result).then(res => res.buffer());
      if (!resultBuffer || resultBuffer.length < 10) return m.reply('❌ Gambar hasil tidak valid.');

      await conn.sendMessage(m.chat, {
        image: resultBuffer,
        caption: '✅ *Gambar berhasil di-HD-kan oleh AutoHD.*',
      }, { quoted: m });

      await conn.sendMessage(m.chat, { delete: loading.key });

    } catch (e) {
      console.error('[AutoHD ERROR]', e);
      m.reply('❌ Terjadi kesalahan saat memproses gambar.');
    }
  }
}

// === Upload helper ===
async function uploadImage(imageBuffer) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) throw new Error('Buffer gambar tidak valid.');
  return await alfixdRaw(imageBuffer);
}

async function alfixdRaw(fileBuffer) {
  try {
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: 'upload.jpg',
      contentType: 'image/jpeg'
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

module.exports = { before };