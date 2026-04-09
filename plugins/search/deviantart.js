import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} elaina`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/deviantart', { action: 'search', query: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const arts = res.result?.deviations || [];
    if (!arts.length) return m.reply('❌ Art tidak ditemukan');

    let txt = `*DEVIANTART* (${res.result?.estTotal || arts.length} hasil)\nQuery: ${text}\n\n`;
    arts.slice(0, 8).forEach((a, i) => {
      const author = a.author?.username || '-';
      txt += `${i + 1}. *${a.title}*\n👤 ${author}\n📅 ${new Date(a.publishedTime).toLocaleDateString('id-ID')}\n🔗 ${a.shortUrl || a.url}\n\n`;
    });

    const first = arts[0];
    if (first?.preview) {
      try {
        const buf = await downloadFile(first.preview.src || first.preview.url);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }

    // Send first few images
    for (let i = 0; i < Math.min(arts.length, 5); i++) {
      const art = arts[i];
      const img = art.preview?.src || art.preview?.url;
      if (!img) continue;
      try {
        const buf = await downloadFile(img);
        const cap = `*DEVIANART #${i + 1}*\n${art.title}\nBy: ${art.author?.username || '-'}`;
        conn.sendMessage(m.chat, { image: buf, caption: cap }, { quoted: m });
      } catch {}
    }
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['deviantart <query>'];
handler.tags = ['search'];
handler.command = /^(deviantart|da)$/i;
handler.limit = 1;

export default handler;
