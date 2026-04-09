import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} redmi 10`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/gsmarena', { q: text });
    if (!res?.success) return m.reply('❌ Gagal mencari');

    const d = res.results;
    const news = d.news || [];
    const reviews = d.reviews || [];

    if (!news.length && !reviews.length) return m.reply('❌ Tidak ditemukan');

    let txt = `*GSM ARENA*\nQuery: ${text}\n\n`;
    
    if (reviews.length) {
      txt += `*REVIEWS*\n`;
      reviews.slice(0, 3).forEach((r, i) => {
        txt += `${i + 1}. ${r.text}\n🔗 https://st.gsmarena.com/${r.href}\n\n`;
      });
    }
    
    if (news.length) {
      txt += `*NEWS*\n`;
      news.slice(0, 5).forEach((n, i) => {
        txt += `${i + 1}. ${n.text}\n🔗 https://st.gsmarena.com/${n.href}\n\n`;
      });
    }

    const firstImg = reviews[0]?.src || news[0]?.src;
    if (firstImg) {
      try {
        const buf = await downloadFile(firstImg);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['gsmarena <query>'];
handler.tags = ['search'];
handler.command = /^(gsmarena|gsm)$/i;
handler.limit = 1;

export default handler;
