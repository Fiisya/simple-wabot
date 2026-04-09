import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://open.spotify.com/track/xxx`);
  m.reply(global.wait);

  try {
    const isUrl = text.startsWith('https://open.spotify.com');
    let res;

    if (isUrl) {
      res = await alfisy('/api/download/spotify', { url: text, action: 'download', fallback: true });
    } else {
      const search = await alfisy('/api/download/spotify', { q: text, action: 'search' });
      if (!search?.status || !search.data?.length) return m.reply('❌ Lagu tidak ditemukan');
      res = await alfisy('/api/download/spotify', { url: search.data[0].url, action: 'download', fallback: true });
    }

    if (!res?.status) return m.reply('❌ Gagal mengambil audio');

    const { title, artist, cover } = res.metadata || {};
    const buf = Buffer.from(res.audio_base64, 'base64');
    const cap = `*SPOTIFY*\nTitle: ${title}\nArtist: ${artist}`;

    conn.sendMessage(m.chat, {
      audio: buf,
      mimetype: 'audio/mpeg',
      contextInfo: { externalAdReply: { title, body: artist, thumbnailUrl: cover, mediaType: 2 } }
    }, { quoted: m });
  } catch (e) {
    console.error('[SP Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['spotify <url/query>'];
handler.tags = ['downloader'];
handler.command = /^(spotify|sp)$/i;
handler.limit = 2;

export default handler;
