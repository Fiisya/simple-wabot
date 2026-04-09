import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  m.reply(global.wait);
  try {
    let url = text;
    if (!url) {
      let buf = m.quoted?.mediaType ? await m.quoted.download() : m.mediaType ? await m.download() : null;
      if (!buf) return m.reply(`Reply gambar atau kirim URL\nContoh: ${usedPrefix + command} https://url.com`);
      const { uploadToAlfis } = await import('../../lib/api.js');
      url = await uploadToAlfis(buf, m.quoted?.message?.[m.quoted.mtype]?.mimetype || 'image/jpeg');
    }
    const res = await alfisy('/api/tools/enhancer', { imageUrl: url });
    if (!res?.success) return m.reply('❌ Gagal');
    const buf = await downloadFile(res.enhancedUrl);
    conn.sendMessage(m.chat, { image: buf, caption: `*ENHANCED*\nScale: ${res.scale || 2}x` }, { quoted: m });
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['enhancer'];
handler.tags = ['tools'];
handler.command = /^(enhancer|enhance|hd)$/i;
handler.limit = 3;

export default handler;
