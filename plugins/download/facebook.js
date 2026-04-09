import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://www.facebook.com/reel/xxx`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/download/aio', { url: text });
    if (!res?.status || !res?.data?.length) return m.reply('❌ Gagal mengambil data. Pastikan URL valid.');

    const data = res.data[0];
    const { title, thumbnail, duration, medias } = data;
    
    // Filter video (HD > SD)
    const videoHD = medias.find(m => m.quality === 'HD' && m.type === 'video');
    const videoSD = medias.find(m => m.quality === 'SD' && m.type === 'video');
    const video = videoHD || videoSD;

    if (!video) return m.reply('❌ Video tidak ditemukan.');

    const durStr = (ms) => {
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    m.reply(`📥 *FACEBOOK DOWNLOAD*\n\n📌 ${title}\n⏱️ Durasi: ${durStr(duration)}\n🎬 Kualitas: ${video.quality}\n\n_Mengirim video..._`);

    const videoBuf = await downloadFile(video.url);

    await conn.sendMessage(m.chat, {
      video: videoBuf,
      mimetype: 'video/mp4',
      caption: `*FACEBOOK VIDEO*\n\n📌 ${title}\n⏱️ ${durStr(duration)}\n🎬 ${video.quality}\n📁 ${(videoBuf.length / 1024 / 1024).toFixed(2)} MB`,
      thumbnail: await downloadFile(thumbnail).catch(() => null)
    }, { quoted: m });

  } catch (e) {
    console.error('[FB Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['fbdl <url>'];
handler.tags = ['downloader'];
handler.command = /^(fbdl|facebookdl|fbdownload)$/i;
handler.limit = 2;

export default handler;
