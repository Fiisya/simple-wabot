import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/tools/chipset-ranking', {});

    if (!result || !result.success) {
      return m.reply('❌ Gagal mengambil data ranking chipset.');
    }

    const chipsets = result.results || [];
    const total = result.total || chipsets.length;

    if (!chipsets || chipsets.length === 0) {
      return m.reply('❌ Data chipset tidak ditemukan.');
    }

    // If user specifies a number, show detail for that rank
    if (text) {
      const rank = parseInt(text);
      const chipset = chipsets.find(c => parseInt(c.rank) === rank);
      
      if (!chipset) {
        return m.reply(`❌ Chipset rank #${rank} tidak ditemukan. Pilih 1-${total}`);
      }

      await m.reply(`┌─⭓「 *CHIPSET RANK #${chipset.rank}* 」\n│\n│ 🔖 *Name:* ${chipset.name}\n│ 🏭 *Manufacturer:* ${chipset.manufacturer}\n│ ⭐ *Rating:* ${chipset.rating}\n│\n│ 📊 *AnTuTu:* ${parseInt(chipset.antutu).toLocaleString()}\n│ 🧪 *GeekBench:* ${chipset.geekbench}\n│\n│ 🔢 *Cores:* ${chipset.cores}\n│ ⚡ *Clock:* ${chipset.clock}\n│ 🎮 *GPU:* ${chipset.gpu}\n│\n└───────────────⭓\n> ${global.wm}`);
      return;
    }

    // Show top 10 list
    let replyText = `┌─⭓「 *CHIPSET RANKING* 」\n│\n│ 📊 *Total:* ${total} chipsets\n│\n`;
    
    chipsets.slice(0, 10).forEach(c => {
      const rating = c.rating?.trim() || '-';
      replyText += `│ *#${c.rank}.* ${c.name}\n`;
      replyText += `│   ⭐ ${rating} | 📊 ${parseInt(c.antutu).toLocaleString()}\n`;
      replyText += `│   🏭 ${c.manufacturer} | 🎮 ${c.gpu}\n│\n`;
    });

    replyText += `│ 💡 Detail: ${usedPrefix + command} <rank>\n│ Contoh: ${usedPrefix + command} 1\n│\n└───────────────⭓\n> ${global.wm}`;

    await m.reply(replyText);

  } catch (e) {
    console.error('[Chipset Ranking Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['chipsetranking'];
handler.tags = ['tools'];
handler.command = /^(chipsetranking|chipset|rankingchip)$/i;
handler.limit = 1;

export default handler;
