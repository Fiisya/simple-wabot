import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/random/animequote', {});

    if (!result || !result.status) {
      return m.reply('❌ Gagal mengambil anime quote.');
    }

    const quotes = result.result || [];

    if (!quotes || quotes.length === 0) {
      return m.reply('❌ Quote tidak ditemukan.');
    }

    // Pick random quote
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const replyText = `┌─⭓「 *ANIME QUOTE* 」\n│\n│ 💬 *"${quote.quote}"*\n│\n│ 👤 *Character:* ${quote.char}\n│ 🎬 *Anime:* ${quote.from_anime}\n│ 📺 *Episode:* ${quote.episode}\n│\n└───────────────⭓\n> ${global.wm}`;

    await m.reply(replyText);

  } catch (e) {
    console.error('[Anime Quote Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['animequote'];
handler.tags = ['random'];
handler.command = /^(animequote|aq|quotes)$/i;
handler.limit = 1;

export default handler;
