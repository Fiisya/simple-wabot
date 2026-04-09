import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *KAMUS BESAR BAHASA INDONESIA* 」\n│\n│ Cari arti kata di KBBI\n│\n│ Contoh:\n│ ${usedPrefix + command} belajar\n│ ${usedPrefix + command}人工智能\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/tools/kbbi', { kata: text });

    if (!result || !result.status) {
      return m.reply('❌ Kata tidak ditemukan di KBBI. Pastikan ejaan benar.');
    }

    const definition = result.result;

    if (!definition) {
      return m.reply('❌ Definisi kata tidak ditemukan.');
    }

    await m.reply(`┌─⭓「 *KBBI* 」\n│\n│ 📖 *Kata:* ${result.kata}\n│\n│ 📝 *Arti:*\n│ ${definition}\n│\n└───────────────⭓\n> ${global.wm}`);

  } catch (e) {
    console.error('[KBBI Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['kbbi <kata>'];
handler.tags = ['tools'];
handler.command = /^(kbbi|kamus|definisi|arti)$/i;
handler.limit = 1;

export default handler;
