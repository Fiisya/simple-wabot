import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} takina`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/pinterest', { q: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const pins = res.result || [];
    if (!pins.length) return m.reply('❌ Gambar tidak ditemukan');

    // Send first 3-5 images
    const max = Math.min(pins.length, 5);
    for (let i = 0; i < max; i++) {
      const pin = pins[i];
      try {
        const buf = await downloadFile(pin.image);
        const cap = `*PINTEREST #${i + 1}*\n${pin.title || 'No Title'}\nBy: ${pin.username || '-'}`;
        conn.sendMessage(m.chat, { image: buf, caption: cap }, { quoted: m });
      } catch {}
    }
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['pinterest <query>'];
handler.tags = ['search'];
handler.command = /^(pinterest|pin)$/i;
handler.limit = 1;

export default handler;
