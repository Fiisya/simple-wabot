import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://www.capcut.com/tv2/xxx`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/download/capcut', { url: text });
    if (!res?.success || !res?.result) return m.reply('❌ Gagal mengambil data. Pastikan URL valid.');

    const { title, author, thumbnail, duration, medias } = res.result;
    
    // Prioritas: hd_no_watermark > no_watermark > watermark
    const video = medias.find(m => m.quality === 'hd_no_watermark') ||
                  medias.find(m => m.quality === 'no_watermark') ||
                  medias.find(m => m.type === 'video');

    if (!video) return m.reply('❌ Video tidak ditemukan.');

    const durStr = (ms) => {
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const qualityLabel = video.quality === 'hd_no_watermark' ? 'HD No WM' :
                         video.quality === 'no_watermark' ? 'No WM' : 'Watermark';

    m.reply(`📥 *CAPCUT DOWNLOAD*\n\n👤 ${author}\n📌 ${title}\n⏱️ ${durStr(duration)}\n🎬 ${qualityLabel}\n\n_Mengirim video..._`);

    const videoBuf = await downloadFile(video.url);

    await conn.sendMessage(m.chat, {
      video: videoBuf,
      mimetype: 'video/mp4',
      caption: `*🎬 CAPCUT VIDEO*\n\n👤 ${author}\n📌 ${title}\n⏱️ ${durStr(duration)}\n🎬 ${qualityLabel}\n📁 ${(videoBuf.length / 1024 / 1024).toFixed(2)} MB`
    }, { quoted: m });

  } catch (e) {
    console.error('[CapCut Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['capcut <url>'];
handler.tags = ['downloader'];
handler.command = /^(capcut|ccdl)$/i;
handler.limit = 2;

export default handler;
