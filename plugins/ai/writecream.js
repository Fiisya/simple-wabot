import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *WRITECREAM AI* 」\n│\n│ Chat dengan WriteCream AI\n│\n│ Contoh:\n│ ${usedPrefix + command} hai perkenalkan nama saya alfi\n│ ${usedPrefix + command} jelaskan tentang AI\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/ai/writecream-chat', { question: text });

    if (!result || !result.status) {
      return m.reply('❌ Gagal menghubungi AI. Coba lagi nanti.');
    }

    const response = result.result;

    if (!response) {
      return m.reply('❌ AI tidak memberikan jawaban.');
    }

    await m.reply(`┌─⭓「 *WRITECREAM AI* 」\n│\n│ ${response}\n│\n└───────────────⭓\n> ${global.wm}`);

  } catch (e) {
    console.error('[WriteCream Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['writecream <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(writecream|wc|wcai)$/i;
handler.limit = 2;

export default handler;
