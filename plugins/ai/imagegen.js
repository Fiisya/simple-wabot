import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *AI IMAGE GENERATOR* 」\n│\n│ Generate gambar dari teks\n│\n│ Contoh:\n│ ${usedPrefix + command} cat playing football\n│ ${usedPrefix + command} anime girl with sword\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/ai/writecream-image', { prompt: text });

    if (!result || !result.status) {
      return m.reply('❌ Gagal generate gambar. Coba lagi nanti.');
    }

    const data = result.result;
    const imageUrl = data.image_url || data.url;

    if (!imageUrl) {
      return m.reply('❌ URL gambar tidak ditemukan.');
    }

    const buffer = await downloadFile(imageUrl);
    const caption = `┌─⭓「 *AI IMAGE* 」\n│\n│ 🎨 *Prompt:* ${text}\n│\n└───────────────⭓\n> ${global.wm}`;

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption,
    }, { quoted: m });

  } catch (e) {
    console.error('[AI Image Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['aiimage <prompt>'];
handler.tags = ['ai'];
handler.command = /^(aiimage|aimage|generate|text2img)$/i;
handler.limit = 3;

export default handler;
