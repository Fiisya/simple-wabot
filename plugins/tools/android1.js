import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *APK SCRAPER* 」\n│\n│ Cari & download APK mod\n│\n│ Perintah:\n│ ${usedPrefix + command} search <query> → Cari APK\n│ ${usedPrefix + command} detail <url>   → Detail APK\n│ ${usedPrefix + command} download <url> → Download APK\n│\n│ Contoh:\n│ ${usedPrefix + command} hill climb racing\n└───────────────⭓`);
  }

  const parts = text.split(' ');
  const action = parts[0]?.toLowerCase();
  const query = parts.slice(1).join(' ');

  // ── SEARCH ──
  if (action === 'search' || !['detail', 'download'].includes(action)) {
    await m.reply(global.wait);

    try {
      const searchQuery = action === 'search' ? query : text;
      const result = await alfisy('/api/tools/android1', {
        action: 'search',
        query: searchQuery,
      });

      if (!result || !result.status) {
        return m.reply('❌ Gagal mencari APK. Coba lagi nanti.');
      }

      const apps = result.result || [];

      if (apps.length === 0) {
        return m.reply('❌ APK tidak ditemukan.');
      }

      let replyText = `┌─⭓「 *APK SEARCH* 」\n│\n│ 🔍 *Query:* ${searchQuery}\n│ 📊 *Total:* ${apps.length} hasil\n│\n`;

      apps.slice(0, 10).forEach((app, i) => {
        replyText += `│ *${i + 1}. ${app.name}*\n`;
        replyText += `│ 👨‍💻 *Dev:* ${app.developer}\n`;
        replyText += `│ ⭐ *Rating:* ${app.rating}\n`;
        replyText += `│ 🔗 ${app.url}\n│\n`;
      });

      replyText += `│ 💡 Detail: ${usedPrefix + command} detail <url>\n│ 💾 Download: ${usedPrefix + command} download <url>\n│\n└───────────────⭓\n> ${global.wm}`;

      await m.reply(replyText);

    } catch (e) {
      console.error('[APK Search Error]', e);
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
        return m.reply('❌ Masukkan URL APK yang valid.');
      }

      const result = await alfisy('/api/tools/android1', {
        action: 'detail',
        url,
      });

      if (!result || !result.status) {
        return m.reply('❌ Gagal mengambil detail APK.');
      }

      const data = result.result;
      const screenshots = data.screenshots || [];

      let replyText = `┌─⭓「 *APK DETAIL* 」\n│\n│ 📱 *Title:* ${data.title}\n│ 👨‍💻 *Dev:* ${data.developer}\n│ 📦 *Version:* ${data.version}\n│ 💾 *Size:* ${data.file_size}\n│ 📱 *OS:* ${data.operating_system}\n│ ⭐ *Rating:* ${data.rating} (${data.rating_count} votes)\n│ 📅 *Updated:* ${data.updated}\n│\n│ 📝 *Description:*\n│ ${data.description?.slice(0, 500)}...\n│\n`;

      if (screenshots.length > 0) {
        replyText += `│ 🖼️ *Screenshots:* ${screenshots.length}\n`;
      }

      replyText += `│\n│ 💾 Download: ${usedPrefix + command} download ${url}\n│\n└───────────────⭓\n> ${global.wm}`;

      // Download icon
      if (data.icon) {
        try {
          const buffer = await downloadFile(data.icon);
          await conn.sendMessage(m.chat, {
            image: buffer,
            caption: replyText,
          }, { quoted: m });
          return;
        } catch (e) {
          console.log('[Icon download failed]');
        }
      }

      await m.reply(replyText);

    } catch (e) {
      console.error('[APK Detail Error]', e);
      await m.reply(`❌ Terjadi error: ${e.message}`);
    }
    return;
  }

  // ── DOWNLOAD ──
  if (action === 'download') {
    await m.reply(global.wait);

    try {
      const url = query;
      if (!url || !url.startsWith('http')) {
        return m.reply('❌ Masukkan URL APK yang valid.');
      }

      const result = await alfisy('/api/tools/android1', {
        action: 'download',
        url,
      });

      if (!result || !result.status) {
        return m.reply('❌ Gagal mendownload APK.');
      }

      const data = result.result;
      const downloadUrl = data.download_url;

      if (!downloadUrl) {
        return m.reply('❌ Link download tidak ditemukan.');
      }

      await m.reply(`┌─⭓「 *APK DOWNLOAD* 」\n│\n│ 📱 *File:* ${data.filename}\n│ 📦 *Version:* ${data.version}\n│\n│ 🔗 *Download URL:*\n│ ${downloadUrl}\n│\n└───────────────⭓\n> ${global.wm}`);

    } catch (e) {
      console.error('[APK Download Error]', e);
      await m.reply(`❌ Terjadi error: ${e.message}`);
    }
    return;
  }

  // ── Help ──
  m.reply(`┌─⭓「 *APK SCRAPER* 」\n│\n│ Perintah:\n│ ${usedPrefix + command} search <query>\n│ ${usedPrefix + command} detail <url>\n│ ${usedPrefix + command} download <url>\n│\n│ Contoh:\n│ ${usedPrefix + command} hill climb racing\n└───────────────⭓`);
};

handler.help = ['apk <action> <query/url>'];
handler.tags = ['tools'];
handler.command = /^(apk|android1|an1|modapk)$/i;
handler.limit = 1;

export default handler;
