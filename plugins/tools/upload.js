import { uploadToAlfis } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  m.reply(global.wait);
  try {
    const buf = m.quoted?.mediaType ? await m.quoted.download() : m.mediaType ? await m.download() : null;
    if (!buf) return m.reply(`Reply gambar\nContoh: ${usedPrefix + command}`);
    const url = await uploadToAlfis(buf, m.quoted?.message?.[m.quoted.mtype]?.mimetype || 'image/jpeg');
    m.reply(`*UPLOADED*\n${url}`);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['upload'];
handler.tags = ['tools'];
handler.command = /^(upload|imgbb)$/i;
handler.limit = 1;

export default handler;
