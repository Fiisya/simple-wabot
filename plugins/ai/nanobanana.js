import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *NANOBANANA AI IMAGE* 」\n│\n│ Edit gambar dengan AI Nanobanana\n│\n│ Cara:\n│ 1. Reply/kirim gambar\n│ 2. ${usedPrefix + command} prompt\n│\n│ Contoh:\n│ ${usedPrefix + command} to ghibli\n│ ${usedPrefix + command} to anime\n│ ${usedPrefix + command} to oil painting\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    // Get image from reply/quoted or current message
    let mediaBuffer = null;
    
    if (m.quoted && m.quoted.mediaType) {
      mediaBuffer = await m.quoted.download();
    } else if (m.mediaType) {
      mediaBuffer = await m.download();
    }

    if (!mediaBuffer) {
      return m.reply('❌ Reply/kirim gambar terlebih dahulu.');
    }

    // POST dengan FormData
    const form = new FormData();
    form.append('file', mediaBuffer, { filename: 'image.jpg' });
    form.append('prompt', text);

    const { data, headers } = await axios.post(
      'https://api.alfisy.my.id/api/ai/nanobanana',
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        timeout: 120000,
      }
    );

    const buffer = Buffer.from(data);
    const contentType = headers['content-type'];

    if (buffer.length < 100) {
      return m.reply('❌ Gagal edit gambar. API timeout atau error.');
    }

    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: contentType || 'image/jpeg',
      caption: `┌─⭓「 *NANOBANANA AI* 」\n│\n│ 🎨 *Prompt:* ${text}\n│\n└───────────────⭓\n> ${global.wm}`,
    }, { quoted: m });

  } catch (e) {
    console.error('[Nanobanana Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['nanobanana <prompt>'];
handler.tags = ['ai'];
handler.command = /^(nanobanana|nanobana|nbnb)$/i;
handler.limit = 5;

export default handler;
