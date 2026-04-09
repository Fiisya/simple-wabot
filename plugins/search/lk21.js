import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} john wick`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/lk21', { action: 'search', query: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const movies = res.result || [];
    if (!movies.length) return m.reply('❌ Film tidak ditemukan');

    let txt = `*LK21* (${movies.length} hasil)\nQuery: ${text}\n\n`;
    movies.slice(0, 8).forEach((mv, i) => {
      txt += `${i + 1}. *${mv.title}* (${mv.year})\n⭐ ${mv.rating} | 📺 ${mv.quality || '-'}\n🔗 ${mv.url}\n\n`;
    });

    const first = movies[0];
    if (first?.poster) {
      try {
        const url = `https://tv10.lk21official.cc/wp-content/uploads/${first.poster}`;
        const buf = await downloadFile(url);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['lk21 <query>'];
handler.tags = ['search'];
handler.command = /^(lk21|film)$/i;
handler.limit = 1;

export default handler;
