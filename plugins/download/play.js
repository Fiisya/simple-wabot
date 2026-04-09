import { alfisy, downloadFile } from '../../lib/api.js';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} dj tiktok viral`);
  await m.reply('🔍 Mencari lagu...');

  try {
    // Search YouTube menggunakan alfisy yts
    const res = await alfisy('/api/search/yts', { q: text });
    if (!res?.status || !res.result?.length) {
      return m.reply('❌ Tidak ditemukan hasil pencarian.');
    }

    const videos = res.result;
    const video = videos[0]; // Ambil video pertama

    await m.reply(`📥 *${video.title}*\n⏱️ ${video.duration}\n👁️ ${video.views} views\n\n⬇️ Downloading audio...`);

    // Download audio dari YouTube
    const apiUrl = `https://api.alfisy.my.id/api/download/youtube?url=${encodeURIComponent(video.url)}`;
    const ytRes = await axios.get(apiUrl);
    const ytData = ytRes.data;

    if (!ytData?.status || !ytData?.videos) {
      return m.reply('❌ Gagal download audio. Coba lagi nanti.');
    }

    // Cari audio
    const aud = ytData.videos.find(v => v.url?.endsWith('.mp3'));
    if (!aud) return m.reply('❌ Audio tidak tersedia.');

    // Download dan kirim audio
    const buf = await downloadFile(aud.url);
    
    await conn.sendMessage(m.chat, {
      audio: buf,
      mimetype: 'audio/mpeg',
      fileName: `${video.title.replace(/[^a-zA-Z0-9 ]/g, '')}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: `🎵 ${video.title}`,
          body: `⏱️ ${video.duration} | 👁️ ${video.views} views`,
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          mediaUrl: video.url,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

  } catch (e) {
    console.error('[Play Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['play <query>'];
handler.tags = ['downloader'];
handler.command = /^(play|ytplay)$/i;
handler.limit = 2;

export default handler;
