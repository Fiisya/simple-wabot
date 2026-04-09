import axios from 'axios';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *SCREENSHOT WEB* 」\n│\n│ Screenshot halaman website\n│\n│ Contoh:\n│ ${usedPrefix + command} https://google.com\n│ ${usedPrefix + command} https://github.com\n│\n│ Tipe: desktop (default), mobile, tablet\n│ ${usedPrefix + command} type=mobile | https://google.com\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    let type = 'mobile';
    let url = text;

    if (text.includes('type=')) {
      const parts = text.split('|').map(p => p.trim());
      const typePart = parts[0];
      url = parts[1] || parts[0];
      type = typePart.match(/type=(\S+)/)?.[1] || 'mobile';
    }

    // Validasi URL
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const { data, headers } = await axios.get('https://api.alfisy.my.id/api/tools/ssweb', {
      params: { url, type },
      responseType: 'arraybuffer',
      timeout: 60000,
    });

    const buffer = Buffer.from(data);
    const contentType = headers['content-type'];

    if (buffer.length < 100) {
      return m.reply('❌ Gagal screenshot. API timeout atau website tidak bisa diakses.');
    }

    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: contentType || 'image/png',
      caption: `┌─⭓「 *SCREENSHOT WEB* 」\n│\n│ 🌐 *URL:* ${url}\n│ 📱 *Type:* ${type}\n│\n└───────────────⭓\n> ${global.wm}`,
    }, { quoted: m });

  } catch (e) {
    console.error('[SSWeb Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['ssweb <url>'];
handler.tags = ['tools'];
handler.command = /^(ssweb|screenshot|ss|sswebmobile)$/i;
handler.limit = 1;

export default handler;
