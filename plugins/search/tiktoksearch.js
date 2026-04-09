import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} mellyn022`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/tiktok', { q: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const videos = res.result || [];
    if (!videos.length) return m.reply('❌ Video tidak ditemukan');

    let txt = `*TIKTOK SEARCH* (${videos.length} hasil)\nQuery: ${text}\n\n`;
    videos.slice(0, 8).forEach((v, i) => {
      const author = v.author?.nickname || '-';
      txt += `${i + 1}. *${v.title || 'No Title'}*\n👤 ${author}\n❤️ ${v.digg_count || 0} | 💬 ${v.comment_count || 0} | 🔄 ${v.share_count || 0}\n\n`;
    });

    const first = videos[0];
    if (first?.cover) {
      try {
        const buf = await downloadFile(first.cover);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['tiktoksearch <query>'];
handler.tags = ['search'];
handler.command = /^(tiktoksearch|ttsearch)$/i;
handler.limit = 1;

export default handler;
