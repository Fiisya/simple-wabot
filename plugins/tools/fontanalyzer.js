import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *FONT ANALYZER* 」\n│\n│ Analisis font di website\n│\n│ Contoh:\n│ ${usedPrefix + command} https://google.com\n│ ${usedPrefix + command} https://ai.alfisy.my.id\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    let url = text;
    if (!url.startsWith('http')) url = 'https://' + url;

    const result = await alfisy('/api/tools/fontanalyzer', { url });

    if (!result || !result.status) {
      return m.reply('❌ Gagal menganalisis font. Pastikan URL valid.');
    }

    const data = result.result;
    const fonts = data.fonts || [];
    const total = data.total_fonts || 0;

    if (total === 0) {
      return m.reply(`┌─⭓「 *FONT ANALYZER* 」\n│\n│ 🌐 *URL:* ${data.url || url}\n│\n│ 📭 *Tidak ada font yang ditemukan*\n│\n└───────────────⭓\n> ${global.wm}`);
    }

    let replyText = `┌─⭓「 *FONT ANALYZER* 」\n│\n│ 🌐 *URL:* ${data.url || url}\n│ 🔢 *Total:* ${total} font\n│\n`;

    fonts.forEach((font, i) => {
      replyText += `│ *${i + 1}.* ${font}\n`;
    });

    replyText += `│\n└───────────────⭓\n> ${global.wm}`;

    await m.reply(replyText);

  } catch (e) {
    console.error('[Font Analyzer Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['fontanalyzer <url>'];
handler.tags = ['tools'];
handler.command = /^(fontanalyzer|fontanalyze|fontcheck|font)$/i;
handler.limit = 1;

export default handler;
