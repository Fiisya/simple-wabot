import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/tools/infogempa', {});

    if (!result || !result.success) {
      return m.reply('❌ Gagal mengambil info gempa. Coba lagi nanti.');
    }

    const data = result.result;
    const shakemapUrl = data.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${data.Shakemap}` : '';

    let replyText = `┌─⭓「 *INFO GEMPA* 」\n│\n`;
    replyText += `│ 📍 *Wilayah:* ${data.wilayah}\n`;
    replyText += `│ 📏 *Magnitude:* ${data.magnitude}\n`;
    replyText += `│ 🌊 *Kedalaman:* ${data.kedalaman}\n`;
    replyText += `│ 🌐 *Koordinat:* ${data.lintang}, ${data.bujur}\n`;
    replyText += `│ ⚠️ *Potensi:* ${data.potensi}\n`;
    replyText += `│ 📢 *Dirasakan:* ${data.dirasakan || '-'}\n`;
    replyText += `│\n└───────────────⭓\n> ${global.wm}`;

    // Kirim shakemap jika ada
    if (shakemapUrl) {
      try {
        const { downloadFile } = await import('../../lib/api.js');
        const buffer = await downloadFile(shakemapUrl);
        
        await conn.sendMessage(m.chat, {
          image: buffer,
          caption: replyText,
        }, { quoted: m });
        return;
      } catch (e) {
        console.log('[Shakemap download failed]');
      }
    }

    await m.reply(replyText);

  } catch (e) {
    console.error('[InfoGempa Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['infogempa'];
handler.tags = ['tools'];
handler.command = /^(infogempa|gempa|gempabumi)$/i;
handler.limit = 1;

export default handler;
