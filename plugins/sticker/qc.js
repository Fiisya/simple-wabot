import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} hai`);
  m.reply(global.wait);

  try {
    let photoUrl = '';
    try { photoUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => ''); } catch {}
    if (!photoUrl) photoUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

    const { data } = await axios.get('https://api.alfisy.my.id/api/maker/qc', {
      params: { text, first_name: m.pushName || 'User', photoUrl },
      responseType: 'arraybuffer',
      timeout: 60000
    });

    const buf = Buffer.from(data);
    if (buf.length < 100) return m.reply('❌ Gagal membuat quote sticker');

    const sticker = new Sticker(buf, {
      pack: m.pushName || 'User',
      author: 'QC Sticker',
      type: 'full',
      categories: ['💬', '🗣️'],
      id: '12345',
      quality: 80,
      background: 'transparent'
    });

    const stickerBuffer = await sticker.toBuffer();
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

  } catch (e) {
    console.error('[QC Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['qc <text>'];
handler.tags = ['sticker'];
handler.command = /^(qc)$/i;
handler.limit = 1;

export default handler;
