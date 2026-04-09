import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} siapa kamu?`);
  m.reply(global.wait);

  try {
    const [sys, q] = text.split('|').map(s => s.trim());
    const params = { prompt: q || text };
    if (sys.startsWith('sys=')) params.system = sys.replace('sys=', '');
    
    const res = await alfisy('/api/ai/gemini', params);
    if (!res?.success) return m.reply('❌ Gagal');
    m.reply(`*GEMINI AI*\n${res.result?.text}`);
  } catch (e) {
    console.error('[Gemini Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['gemini <text>'];
handler.tags = ['ai'];
handler.command = /^(gemini)$/i;
handler.limit = 2;

export default handler;
