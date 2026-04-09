import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} naruto`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/komikcast', { q: text });
    if (!res?.success) return m.reply('❌ Gagal mencari');

    const series = res.result?.series || [];
    if (!series.length) return m.reply('❌ Komik tidak ditemukan');

    let txt = `*KOMIKCAST* (${series.length} hasil)\nQuery: ${text}\n\n`;
    series.slice(0, 8).forEach((s, i) => {
      txt += `${i + 1}. *${s.title}*\n⭐ ${s.rating} | 📚 ${s.totalChapters} ch | 📅 ${s.releaseDate}\n📖 ${s.status} | 🎭 ${s.genres?.slice(0, 3).join(', ') || '-'}\n\n`;
    });

    const first = series[0];
    if (first?.coverImage) {
      try {
        const buf = await downloadFile(first.coverImage.split('?')[0]);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['komikcast <query>'];
handler.tags = ['search'];
handler.command = /^(komikcast|komik|manga)$/i;
handler.limit = 1;

export default handler;
