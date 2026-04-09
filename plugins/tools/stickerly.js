import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *STICKERLY* 」\n│\n│ Cari & download sticker pack\n│\n│ Perintah:\n│ ${usedPrefix + command} search <query> → Cari pack\n│ ${usedPrefix + command} detail <url>   → Detail pack\n│ ${usedPrefix + command} download <url>  → Download sticker\n│\n│ Contoh:\n│ ${usedPrefix + command} jomok\n└───────────────⭓`);
  }

  const parts = text.split(' ');
  const action = parts[0]?.toLowerCase();
  const query = parts.slice(1).join(' ');

  // ── SEARCH ──
  if (action === 'search' || !['detail', 'download'].includes(action)) {
    await m.reply(global.wait);

    try {
      const searchQuery = action === 'search' ? query : text;
      const result = await alfisy('/api/tools/stickerly', {
        action: 'search',
        query: searchQuery,
      });

      if (!result || !result.status) {
        return m.reply('❌ Gagal mencari sticker pack.');
      }

      const packs = result.result || [];

      if (packs.length === 0) {
        return m.reply('❌ Sticker pack tidak ditemukan.');
      }

      let replyText = `┌─⭓「 *STICKERLY SEARCH* 」\n│\n│ 🔍 *Query:* ${searchQuery}\n│ 📊 *Total:* ${packs.length} pack\n│\n`;

      packs.slice(0, 10).forEach((pack, i) => {
        const paid = pack.isPaid ? '💰 Paid' : '✅ Free';
        const animated = pack.isAnimated ? '🎬 Animated' : '🖼️ Static';
        replyText += `│ *${i + 1}. ${pack.name}*\n`;
        replyText += `│ 👤 *Author:* ${pack.author}\n`;
        replyText += `│ 📦 *Stickers:* ${pack.stickerCount}\n`;
        replyText += `│ 👁️ *Views:* ${pack.viewCount?.toLocaleString()}\n`;
        replyText += `│ 📥 *Exports:* ${pack.exportCount?.toLocaleString()}\n`;
        replyText += `│ 🏷️ *${paid} • ${animated}*\n`;
        replyText += `│ 🔗 ${pack.url}\n│\n`;
      });

      replyText += `│ 💡 Detail: ${usedPrefix + command} detail <url>\n│\n└───────────────⭓\n> ${global.wm}`;

      const firstPack = packs[0];
      if (firstPack?.thumbnailUrl) {
        try {
          const buffer = await downloadFile(firstPack.thumbnailUrl);
          await conn.sendMessage(m.chat, {
            image: buffer,
            caption: replyText,
          }, { quoted: m });
          return;
        } catch (e) {
          console.log('[Thumbnail download failed]');
        }
      }

      await m.reply(replyText);

    } catch (e) {
      console.error('[Stickerly Search Error]', e);
      await m.reply(`❌ Terjadi error: ${e.message}`);
    }
    return;
  }

  // ── DETAIL ──
  if (action === 'detail') {
    await m.reply(global.wait);

    try {
      const url = query;
      if (!url || !url.startsWith('http')) {
        return m.reply('❌ Masukkan URL sticker pack yang valid.');
      }

      const result = await alfisy('/api/tools/stickerly', {
        action: 'detail',
        url,
      });

      if (!result || !result.status) {
        return m.reply('❌ Gagal mengambil detail sticker pack.');
      }

      const data = result.result;
      const stickers = data.stickers || [];
      const author = data.author || {};

      let replyText = `┌─⭓「 *STICKER PACK DETAIL* 」\n│\n│ 📦 *Name:* ${data.name}\n│ 👤 *Author:* ${author.name || author.username}\n│ 📝 *Bio:* ${author.bio || '-'}\n│ 👥 *Followers:* ${author.followers || 0}\n│\n│ 📊 *Total Stickers:* ${stickers.length}\n│\n`;

      stickers.slice(0, 5).forEach((sticker, i) => {
        replyText += `│ *${i + 1}.* ${sticker.fileName}\n`;
        replyText += `│    ${sticker.isAnimated ? '🎬' : '🖼️'} ${sticker.imageUrl}\n│\n`;
      });

      if (stickers.length > 5) {
        replyText += `│ ... dan ${stickers.length - 5} sticker lainnya\n│\n`;
      }

      replyText += `│ 💾 Download semua: ${usedPrefix + command} download ${url}\n│\n└───────────────⭓\n> ${global.wm}`;

      // Download first sticker
      if (stickers.length > 0) {
        try {
          const buffer = await downloadFile(stickers[0].imageUrl);
          await conn.sendMessage(m.chat, {
            image: buffer,
            caption: replyText,
          }, { quoted: m });
          return;
        } catch (e) {
          console.log('[Sticker download failed]');
        }
      }

      await m.reply(replyText);

    } catch (e) {
      console.error('[Stickerly Detail Error]', e);
      await m.reply(`❌ Terjadi error: ${e.message}`);
    }
    return;
  }

  // ── DOWNLOAD ALL STICKERS ──
  if (action === 'download') {
    await m.reply(global.wait);

    try {
      const url = query;
      if (!url || !url.startsWith('http')) {
        return m.reply('❌ Masukkan URL sticker pack yang valid.');
      }

      const result = await alfisy('/api/tools/stickerly', {
        action: 'detail',
        url,
      });

      if (!result || !result.status) {
        return m.reply('❌ Gagal mendownload sticker pack.');
      }

      const stickers = result.result?.stickers || [];

      if (stickers.length === 0) {
        return m.reply('❌ Tidak ada sticker dalam pack ini.');
      }

      const maxDownload = Math.min(stickers.length, 10);
      await m.reply(`📥 Mendownload ${maxDownload} sticker...`);

      for (let i = 0; i < maxDownload; i++) {
        try {
          const buffer = await downloadFile(stickers[i].imageUrl);
          await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `📦 *${stickers[i].fileName}*\n> ${i + 1}/${maxDownload}`,
          }, { quoted: m });
          await new Promise(r => setTimeout(r, 1000)); // Delay 1s
        } catch (e) {
          console.log(`[Sticker ${i + 1} download failed]`);
        }
      }

    } catch (e) {
      console.error('[Stickerly Download Error]', e);
      await m.reply(`❌ Terjadi error: ${e.message}`);
    }
    return;
  }
};

handler.help = ['stickerly <action> <query/url>'];
handler.tags = ['tools'];
handler.command = /^(stickerly|sticker|stiker)$/i;
handler.limit = 2;

export default handler;
