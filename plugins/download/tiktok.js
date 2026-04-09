import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://vt.tiktok.com/xxx`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/download/tiktok', { url: text });
    if (!res?.status) return m.reply('❌ Gagal mengambil data');

    const d = res.data;
    
    // Fix: Handle title kosong dari API
    const title = d.title || d.author?.nickname || 'TikTok Video';
    const cap = `*TIKTOK ${d.images?.length ? 'SLIDESHOW' : 'VIDEO'}*
━━━━━━━━━━━━━━━
📝 Title: ${title}
👤 Author: ${d.author?.nickname || 'Unknown'}
🎵 Music: ${d.music_info?.title || 'Unknown'}
👁️ Views: ${d.play_count || 0}
❤️ Likes: ${d.digg_count || 0}
💬 Comments: ${d.comment_count || 0}`;

    if (d.images?.length) {
      // Slideshow mode
      for (let i = 0; i < d.images.length; i++) {
        const buf = await downloadFile(d.images[i]);
        await conn.sendMessage(m.chat, { 
          image: buf, 
          caption: i === 0 ? cap : `Foto ${i + 1}/${d.images.length}` 
        }, { quoted: m });
      }
      
      // Send audio setelah slideshow
      if (d.music) {
        try {
          const audioBuf = await downloadFile(d.music);
          await conn.sendMessage(m.chat, { 
            audio: audioBuf, 
            mimetype: 'audio/mpeg',
            fileName: `${d.music_info?.title || 'tiktok_audio'}.mp3`,
            ptt: false
          }, { quoted: m });
        } catch (audioErr) {
          console.log('[TT Audio Error]', audioErr.message);
        }
      }
      
    } else {
      // Video mode
      const url = d.play || d.wmplay;
      if (!url) return m.reply('❌ Video tidak ditemukan');
      
      const buf = await downloadFile(url);
      await conn.sendMessage(m.chat, { 
        video: buf, 
        caption: cap,
        mimetype: 'video/mp4' 
      }, { quoted: m });
      
      // Send audio setelah video
      if (d.music) {
        try {
          const audioBuf = await downloadFile(d.music);
          await conn.sendMessage(m.chat, { 
            audio: audioBuf, 
            mimetype: 'audio/mpeg',
            fileName: `${d.music_info?.title || 'tiktok_audio'}.mp3`,
            ptt: false
          }, { quoted: m });
        } catch (audioErr) {
          console.log('[TT Audio Error]', audioErr.message);
        }
      }
    }
    
  } catch (e) {
    console.error('[TT Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['tiktok <url>'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|tt|tiktokdl)$/i;
handler.limit = 2;

export default handler;
