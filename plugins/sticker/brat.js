import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} hai`);
  m.reply(global.wait);

  try {
    let response;
    
    // Primary API
    const primaryUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}&background=#ffffff&color=#000000&emojiStyle=apple`;
    
    try {
      response = await axios.get(primaryUrl, {
        responseType: 'arraybuffer',
        timeout: 15000
      });
    } catch (primaryError) {
      console.log('[Brat] Primary API failed, trying fallback...');
      
      // Fallback API 1
      const fallbackUrl1 = `https://anabot.my.id/api/maker/brat?text=${encodeURIComponent(text)}&apikey=freeApikey`;
      try {
        response = await axios.get(fallbackUrl1, {
          responseType: 'arraybuffer',
          timeout: 15000
        });
      } catch (fallbackError1) {
        console.log('[Brat] Fallback API 1 failed, trying fallback 2...');
        
        // Fallback API 2
        const fallbackUrl2 = `https://api.alfisy.my.id/api/maker/brat?text=${encodeURIComponent(text)}`;
        response = await axios.get(fallbackUrl2, {
          responseType: 'arraybuffer',
          timeout: 15000
        });
      }
    }

    const buffer = Buffer.from(response.data);
    
    if (buffer.length < 100) return m.reply('❌ Gagal generate brat. Hasil buffer terlalu kecil.');

    // Convert ke sticker dengan wa-sticker-formatter
    const sticker = new Sticker(buffer, {
      pack: global.packname || 'ayanaMD',
      author: global.author || 'KennDev',
      type: 'image/png',
    });

    const stickerBuffer = await sticker.toBuffer();
    
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
    
  } catch (e) {
    console.error('[Brat Sticker Error]', e);
    m.reply(`❌ Error: ${e.message}\n\nSemua API gagal. Coba lagi nanti.`);
  }
};

handler.help = ['brat <text>'];
handler.tags = ['sticker'];
handler.command = /^(brat)$/i;
handler.limit = 1;

export default handler;
