import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *CEK IMEI* 」\n│\n│ Cek info perangkat dari IMEI\n│\n│ Cara:\n│ Ketik *#06# di HP untuk lihat IMEI\n│\n│ Contoh:\n│ ${usedPrefix + command} 865010063840980\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/tools/cek-imei', { imei: text });

    if (!result || !result.status) {
      return m.reply('❌ Gagal cek IMEI. Pastikan nomor IMEI valid (15 digit).');
    }

    const data = result.results?.result;

    if (!data) {
      return m.reply('❌ Data IMEI tidak ditemukan.');
    }

    const header = data.header || {};
    const items = data.items || [];
    const brand = header.brand || 'Unknown';
    const model = header.model || 'Unknown';
    const photoUrl = header.photo || '';
    const imei = header.imei || text;

    // Extract key info from items
    const getInfo = (title) => items.find(i => i.title === title)?.content || '-';

    const replyText = `┌─⭓「 *IMEI CHECK* 」\n│\n│ 📱 *Brand:* ${brand}\n│ 🔖 *Model:* ${model}\n│ 🔢 *IMEI:* ${imei}\n│\n│ 📅 *Release:* ${getInfo('Relase Year')}\n│ 💻 *OS:* ${getInfo('Operating systems')}\n│ 🔧 *Chipset:* ${getInfo('Chipset')}\n│ 🎮 *GPU:* ${getInfo('GPU type')}\n│\n│ 📐 *Dimensions:* ${getInfo('Height')} x ${getInfo('Width')} x ${getInfo('Thickness')}\n│ 📺 *Display:* ${getInfo('Display type')} ${getInfo('Display ')}\n│ 📏 *Diagonal:* ${getInfo('Diagonal ')}\n│\n│ 📶 *Network:*\n│   5G: ${getInfo('5G')}\n│   4G: ${getInfo('4G')}\n│   3G: ${getInfo('3G')}\n│\n│ 🔋 *Battery:* ${getInfo('Capacity')} ${getInfo('Type')}\n│ 📸 *Camera:* ${getInfo('Main')} / Selfie: ${getInfo('Selfie')}\n│\n└───────────────⭓\n> ${global.wm}`;

    // Download phone photo if available
    if (photoUrl) {
      try {
        const buffer = await downloadFile(photoUrl);
        
        await conn.sendMessage(m.chat, {
          image: buffer,
          caption: replyText,
        }, { quoted: m });
        return;
      } catch (e) {
        console.log('[Phone photo download failed]');
      }
    }

    await m.reply(replyText);

  } catch (e) {
    console.error('[IMEI Check Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['cekimei <imei>'];
handler.tags = ['tools'];
handler.command = /^(cekimei|imei|checkimei)$/i;
handler.limit = 1;

export default handler;
