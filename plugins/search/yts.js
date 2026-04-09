import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} masing masing`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/yts', { q: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const videos = res.result || [];
    if (!videos.length) return m.reply('❌ Video tidak ditemukan');

    let txt = `*YOUTUBE SEARCH* (${videos.length} hasil)\nQuery: ${text}\n\n`;
    videos.slice(0, 8).forEach((v, i) => {
      txt += `${i + 1}. *${v.title}*\n⏱️ ${v.duration} | 👁️ ${v.views}\n📅 ${v.uploaded}\n🔗 ${v.url}\n\n`;
    });

    const first = videos[0];
    if (first?.thumbnail) {
      try {
        const buf = await downloadFile(first.thumbnail);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['yts <query>'];
handler.tags = ['search'];
handler.command = /^(yts|ytsearch|youtubesearch)$/i;
handler.limit = 1;

export default handler;
