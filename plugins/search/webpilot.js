import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} siapa presiden Indonesia`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/webpilot', { q: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const d = res.result;
    const content = d.content || '';
    const sources = d.sources || [];

    // Clean and shorten content (remove duplicates/glitch text)
    const clean = content.replace(/SebelSebelSelamaSelamaum.*/s, '').trim().slice(0, 2000);

    let txt = `*WEBPILOT AI*\nQuery: ${text}\n\n${clean}`;
    if (sources.length) {
      txt += `\n\n🔗 *Sources:*\n${sources.slice(0, 3).map(s => `• [${s.title}](${s.link})`).join('\n')}`;
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['webpilot <query>'];
handler.tags = ['search'];
handler.command = /^(webpilot|wp)$/i;
handler.limit = 1;

export default handler;
