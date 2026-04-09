import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://pin.it/xxx`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/download/aio', { url: text });
    if (!res?.status || !res?.data?.length) return m.reply('❌ Gagal mengambil data. Pastikan URL valid.');

    const data = res.data[0];
    const { author, title, thumbnail, medias } = data;

    const video = medias.find(m => m.type === 'video');
    const image = medias.find(m => m.type === 'image');

    if (!video && !image) return m.reply('❌ Media tidak ditemukan.');

    const resolution = video ? (video.resolution || video.quality || '') : '';

    m.reply(`📥 *PINTEREST DOWNLOAD*\n\n👤 ${author || 'Unknown'}\n📌 ${title || 'No description'}${resolution ? `\n🎬 ${resolution}` : ''}\n\n_Mengirim media..._`);

    if (video) {
      const videoBuf = await downloadFile(video.url);
      await conn.sendMessage(m.chat, {
        video: videoBuf,
        mimetype: 'video/mp4',
        caption: `*📌 PINTEREST VIDEO*\n\n👤 ${author || 'Unknown'}\n📌 ${title || 'No description'}\n🎬 ${resolution}\n📁 ${(videoBuf.length / 1024 / 1024).toFixed(2)} MB`
      }, { quoted: m });
    } else if (image) {
      const imageBuf = await downloadFile(image.url);
      await conn.sendMessage(m.chat, {
        image: imageBuf,
        caption: `*📌 PINTEREST IMAGE*\n\n👤 ${author || 'Unknown'}\n📌 ${title || 'No description'}`
      }, { quoted: m });
    }

  } catch (e) {
    console.error('[Pinterest Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['pinterest <url>'];
handler.tags = ['downloader'];
handler.command = /^(pinterest|pindl|pin)$/i;
handler.limit = 2;

export default handler;
