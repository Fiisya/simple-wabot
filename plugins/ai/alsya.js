import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} siapa kamu?`);
  m.reply(global.wait);

  try {
    const session = Buffer.from(m.sender).toString('base64');
    const res = await alfisy('/api/ai/alsya', { q: text, session });
    if (!res?.status) return m.reply('❌ ' + (res?.message || 'Gagal'));
    m.reply(`${res.response}`);
  } catch (e) {
    console.error('[AI Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['alsya <text>'];
handler.tags = ['ai'];
handler.command = /^(alsya|ai)$/i;
handler.limit = 2;

export default handler;
