import { alfisyPost } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  await m.reply(global.wait);

  try {
    let mediaBuffer = null;
    
    if (m.quoted && m.quoted.mediaType) {
      mediaBuffer = await m.quoted.download();
    } else if (m.mediaType) {
      mediaBuffer = await m.download();
    }

    if (!mediaBuffer) {
      return m.reply(`┌─⭓「 *NSFW CHECK* 」\n│\n│ Cek apakah gambar NSFW atau aman\n│\n│ Cara:\n│ 1. Reply/kirim gambar\n│ 2. ${usedPrefix + command}\n└───────────────⭓`);
    }

    const result = await alfisyPost('/api/tools/nsfwcheck', {
      file: mediaBuffer,
    });

    if (!result || !result.status) {
      return m.reply('❌ Gagal cek gambar. Coba lagi nanti.');
    }

    const data = result.result;
    const isNSFW = data.is_nsfw;
    const isSafe = data.is_safe;
    const confidence = data.confidence;
    const description = data.description;

    const emoji = isNSFW ? '⚠️' : isSafe ? '✅' : '❓';
    const status = isNSFW ? 'NSFW (Tidak Aman)' : isSafe ? 'SAFE (Aman)' : 'Tidak Terdeteksi';

    await m.reply(`┌─⭓「 *NSFW CHECK* 」\n│\n│ ${emoji} *Status:* ${status}\n│ 🎯 *Confidence:* ${confidence}\n│ 📝 *Description:* ${description}\n│\n└───────────────⭓\n> ${global.wm}`);

  } catch (e) {
    console.error('[NSFW Check Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['nsfwcheck'];
handler.tags = ['tools'];
handler.command = /^(nsfwcheck|nsfw|ceknsfw|safecheck)$/i;
handler.limit = 1;

export default handler;
