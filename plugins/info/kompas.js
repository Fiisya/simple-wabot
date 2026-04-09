import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *BERITA KOMPAS* 」\n│\n│ Baca berita dari Kompas\n│\n│ Kategori:\n│ - nasional\n│ - internasional\n│ - ekonomi\n│ - teknologi\n│ - olahraga\n│ - hiburan\n│\n│ Contoh:\n│ ${usedPrefix + command} nasional\n│ ${usedPrefix + command} teknologi\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/news/kompas', { section: text });

    if (!result || !result.status) {
      return m.reply('❌ Gagal mengambil berita. Coba lagi nanti.');
    }

    const newsData = result.result;
    const articles = newsData?.data?.mainNews || [];
    const title = newsData?.title || 'Kompas News';

    if (!articles || articles.length === 0) {
      return m.reply('❌ Berita tidak ditemukan.');
    }

    let replyText = `┌─⭓「 *${title}* 」\n│\n`;
    
    articles.slice(0, 10).forEach((article, i) => {
      replyText += `│ *${i + 1}. ${article.title}*\n`;
      replyText += `│ 🔗 ${article.link || 'N/A'}\n│\n`;
    });
    
    replyText += `└───────────────⭓\n> ${global.wm}`;

    await m.reply(replyText);

  } catch (e) {
    console.error('[Kompas Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['kompas <section>'];
handler.tags = ['news'];
handler.command = /^(kompas|news|berita)$/i;
handler.limit = 1;

export default handler;
