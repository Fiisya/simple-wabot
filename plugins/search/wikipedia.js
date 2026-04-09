import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *WIKIPEDIA SEARCH* 」\n│\n│ Cari artikel di Wikipedia\n│\n│ Contoh:\n│ ${usedPrefix + command} artificial intelligence\n│ ${usedPrefix + command} react js\n│ ${usedPrefix + command} javascript\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/search/wikipedia', { q: text });

    if (!result || !result.success) {
      return m.reply('❌ Gagal mencari di Wikipedia. Coba lagi nanti.');
    }

    const data = result.result;

    if (!data || data.status !== 'success') {
      return m.reply('❌ Artikel tidak ditemukan.');
    }

    const title = data.title || 'Wikipedia';
    const summary = data.summary || 'No summary available';
    const url = data.url || '';

    await m.reply(`┌─⭓「 *WIKIPEDIA* 」\n│\n│ 📖 *Title:* ${title}\n│\n│ ${summary.slice(0, 1000)}${summary.length > 1000 ? '...' : ''}\n│\n│ 🔗 *URL:* ${url}\n│\n└───────────────⭓\n> ${global.wm}`);

  } catch (e) {
    console.error('[Wikipedia Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['wikipedia <query>'];
handler.tags = ['search'];
handler.command = /^(wikipedia|wiki|wp)$/i;
handler.limit = 1;

export default handler;
