import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *AI EDIT IMAGE* 」\n│\n│ Edit gambar dengan AI\n│\n│ Cara:\n│ 1. Reply/kirim gambar\n│ 2. ${usedPrefix + command} prompt\n│\n│ Model: nano-banana (default), flux, sdxl\n│\n│ Contoh:\n│ ${usedPrefix + command} to ghibli\n│ ${usedPrefix + command} model=flux | to anime\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    let model = 'nano-banana';
    let prompt = text;

    if (text.includes('model=')) {
      const parts = text.split('|').map(p => p.trim());
      const modelPart = parts[0];
      prompt = parts[1] || parts[0];
      model = modelPart.match(/model=(\S+)/)?.[1] || 'nano-banana';
    }

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
    form.append('prompt', prompt);
    form.append('model', model);

    const { data, headers } = await axios.post(
      'https://api.alfisy.my.id/api/ai/editimage',
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
      caption: `┌─⭓「 *AI EDIT IMAGE* 」\n│\n│ 🎨 *Prompt:* ${prompt}\n│ 🔧 *Model:* ${model}\n│\n└───────────────⭓\n> ${global.wm}`,
    }, { quoted: m });

  } catch (e) {
    console.error('[AI Edit Image Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['editimage <prompt>'];
handler.tags = ['ai'];
handler.command = /^(editimage|editimg|toanime|aiart)$/i;
handler.limit = 5;

export default handler;
