import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *DEEPSEEK AI* 」\n│\n│ Chat dengan DeepSeek AI\n│\n│ Contoh:\n│ ${usedPrefix + command} siapakah kamu?\n│ ${usedPrefix + command} buatkan kode python\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const session = Buffer.from(m.sender).toString('base64');
    const result = await alfisy('/api/ai/deepseek-chat', {
      prompt: text,
      session,
    });

    if (!result || !result.status) {
      return m.reply('❌ ' + (result?.message || 'Gagal menghubungi DeepSeek AI.'));
    }

    const response = result.result?.reply;

    if (!response) {
      return m.reply('❌ AI tidak memberikan jawaban.');
    }

    await m.reply(`┌─⭓「 *DEEPSEEK AI* 」\n│\n│ ${response}\n│\n└───────────────⭓\n> ${global.wm}`);

  } catch (e) {
    console.error('[DeepSeek Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['deepseek <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(deepseek|ds|deepseekai)$/i;
handler.limit = 2;

export default handler;
