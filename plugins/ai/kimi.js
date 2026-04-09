import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} siapa kamu?`);
  m.reply(global.wait);

  try {
    const session = Buffer.from(m.sender).toString('base64');
    const [sys, q] = text.includes('|') ? text.split('|').map(s => s.trim()) : [null, text];
    const params = { prompt: q, session };
    if (sys?.startsWith('sys=')) params.system = sys.replace('sys=', '');

    const res = await alfisy('/api/ai/kimi-chat', params);
    if (!res?.status) return m.reply('❌ Gagal');
    m.reply(`*KIMI AI*\n${res.result?.reply}`);
  } catch (e) {
    console.error('[Kimi Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['kimi <text>'];
handler.tags = ['ai'];
handler.command = /^(kimi)$/i;
handler.limit = 2;

export default handler;
