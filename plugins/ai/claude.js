import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *CLAUDE AI* 」\n│\n│ Chat dengan Claude AI (Anthropic)\n│\n│ Contoh:\n│ ${usedPrefix + command} siapakah kamu?\n│ ${usedPrefix + command} jelaskan tentang React\n│\n│ Dengan system prompt:\n│ ${usedPrefix + command} sys=kamu adalah svazer | halo\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    let system = '';
    let query = text;

    if (text.includes('sys=')) {
      const parts = text.split('|').map(p => p.trim());
      system = parts[0].match(/sys=(.+)/)?.[1]?.trim() || '';
      query = parts[1] || parts[0];
    }

    const params = { prompt: query };
    if (system) params.system = system;

    const result = await alfisy('/api/ai/claude-chat', params);

    if (!result || !result.status) {
      return m.reply('❌ Gagal menghubungi Claude AI. Coba lagi nanti.');
    }

    const data = result.result;
    const response = data.reply || data.text || data.response;
    const model = data.model || 'claude';

    if (!response) {
      return m.reply('❌ AI tidak memberikan jawaban.');
    }

    await m.reply(`${response}`);

  } catch (e) {
    console.error('[Claude Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['claude <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(claude|claudeai)$/i;
handler.limit = 2;

export default handler;
