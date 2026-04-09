import { writeExif } from '../../lib/sticker.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const quoted = m.quoted || m;
  if (!quoted.mediaType) return m.reply(`Reply gambar/video!\nContoh: ${usedPrefix + command} My Sticker`);
  
  const [pack, author] = text.includes('|') ? text.split('|').map(s => s.trim()) : text.split(/\s+/);
  await m.reply(global.wait);

  try {
    const buf = await quoted.download();
    const mime = quoted.message?.[quoted.mtype]?.mimetype || '';
    const ext = mime.includes('webp') ? 'webp' : mime.includes('video') ? 'mp4' : 'png';

    const media = { data: buf, mimetype: mime, ext };
    const sticker = await writeExif(media, {
      packName: pack || global.packname,
      packPublish: author || global.author,
    });

    conn.sendMessage(m.chat, { sticker }, { quoted: m });
  } catch (e) {
    m.reply(`❌ Gagal: ${e.message}`);
  }
};

handler.help = ['sticker <pack|author>'];
handler.tags = ['sticker'];
handler.command = /^(sticker|s|stic)$/i;

export default handler;
