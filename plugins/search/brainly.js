import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} kenapa aku wni`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/brainly', { query: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const results = res.result || [];
    if (!results.length) return m.reply('❌ Tidak ditemukan');

    let txt = `*BRAINLY* (${results.length} hasil)\nQuery: ${text}\n\n`;
    results.slice(0, 5).forEach((r, i) => {
      const q = cleanHtml(r.question?.content);
      const a = cleanHtml(r.question?.answer?.content);
      const author = r.question?.answer?.author?.nick || '-';
      txt += `${i + 1}. *Pertanyaan:* ${q}\n👤 ${author}\n\n💡 *Jawaban:*\n${a || '-'}\n\n`;
    });

    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '').trim();
}

handler.help = ['brainly <query>'];
handler.tags = ['search'];
handler.command = /^(brainly|br)$/i;
handler.limit = 1;

export default handler;
