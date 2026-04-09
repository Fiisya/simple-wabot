import { fileTypeFromBuffer } from 'file-type';

const handler = async (m, { conn }) => {
  const quoted = m.quoted || m;
  if (quoted.mediaType !== 'stickerMessage') return m.reply('Reply stiker dulu!');
  await m.reply(global.wait);
  const buf  = await quoted.download();
  await conn.sendMessage(m.chat, { image: buf, caption: global.wm }, { quoted: m });
};

handler.help    = ['toimg'];
handler.tags    = ['sticker'];
handler.command = /^(toimg|stickertoimage|stoi)$/i;
export default handler;
