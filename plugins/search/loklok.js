import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} climx`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/loklok', { q: text });
    if (!res?.success) return m.reply('❌ Gagal mencari');

    const results = res.search?.results || [];
    if (!results.length) return m.reply('❌ Film tidak ditemukan');

    let txt = `*LOKLOK SEARCH* (${results.length} results)\nQuery: ${text}\n\n`;
    results.slice(0, 10).forEach((r, i) => {
      txt += `${i + 1}. *${r.title}* (${r.year})\n⭐ ${r.rating} | ⏱️ ${r.duration} | 📺 ${r.quality}\n🎭 ${r.categories?.join(', ') || '-'}\n🌍 ${r.countries?.join(', ') || '-'}\n\n`;
    });

    const first = results[0];
    if (first?.thumbnail) {
      try {
        const thumbUrl = first.thumbnail.startsWith('http') ? first.thumbnail : first.thumbnail.replace(/^https:\/\/klikxxi\.mehttps/, 'https');
        const buf = await downloadFile(thumbUrl);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['loklok <query>'];
handler.tags = ['search'];
handler.command = /^(loklok|movie)$/i;
handler.limit = 1;

export default handler;
