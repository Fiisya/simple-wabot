import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} whatsapp bot`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/github-search', { q: text });
    if (!res?.success) return m.reply('❌ Gagal mencari');

    const items = res.items || [];
    if (!items.length) return m.reply('❌ Repository tidak ditemukan');

    let txt = `*GITHUB SEARCH* (${res.total_count || items.length} hasil)\nQuery: ${text}\n\n`;
    items.slice(0, 8).forEach((r, i) => {
      txt += `${i + 1}. *${r.full_name}*\n⭐ ${r.stargazers_count} | 🍴 ${r.forks_count} | 📅 ${new Date(r.created_at).getFullYear()}\n${r.description || '-'}\n🔗 ${r.html_url}\n\n`;
    });

    const first = items[0];
    if (first?.owner?.avatar_url) {
      try {
        const buf = await downloadFile(first.owner.avatar_url);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['github <query>'];
handler.tags = ['search'];
handler.command = /^(github|gh)$/i;
handler.limit = 1;

export default handler;
