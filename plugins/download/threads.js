import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://www.threads.com/@user/post/xxx`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/download/aio', { url: text });
    if (!res?.status || !res?.data?.length) return m.reply('❌ Gagal mengambil data. Pastikan URL valid.');

    const data = res.data[0];
    const { author, title, thumbnail, medias } = data;

    // Filter video (prioritas kualitas tertinggi)
    const video = medias.find(m => m.type === 'video' && m.quality?.includes('576')) ||
                  medias.find(m => m.type === 'video' && m.quality?.includes('480')) ||
                  medias.find(m => m.type === 'video') ||
                  medias.find(m => m.type === 'image');

    if (!video) return m.reply('❌ Media tidak ditemukan.');

    const isVideo = video.type === 'video';
    const resolution = video.resolution || video.quality || 'Unknown';

    m.reply(`📥 *THREADS DOWNLOAD*\n\n👤 ${author || 'Unknown'}\n📌 ${title || 'No description'}\n🎬 ${resolution}\n\n_Mengirim media..._`);

    const mediaBuf = await downloadFile(video.url);

    if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: mediaBuf,
        mimetype: 'video/mp4',
        caption: `*📱 THREADS VIDEO*\n\n👤 ${author || 'Unknown'}\n📌 ${title || 'No description'}\n🎬 ${resolution}\n📁 ${(mediaBuf.length / 1024 / 1024).toFixed(2)} MB`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        image: mediaBuf,
        caption: `*📱 THREADS IMAGE*\n\n👤 ${author || 'Unknown'}\n📌 ${title || 'No description'}`
      }, { quoted: m });
    }

  } catch (e) {
    console.error('[Threads Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = /^(threads|threadsdl|tdl)$/i;
handler.limit = 2;

export default handler;
