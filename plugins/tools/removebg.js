import FormData from 'form-data';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  m.reply(global.wait);
  try {
    const buf = m.quoted?.mediaType ? await m.quoted.download() : m.mediaType ? await m.download() : null;
    if (!buf) return m.reply(`Reply gambar\nContoh: ${usedPrefix + command}`);

    const form = new FormData();
    form.append('file', buf, { filename: 'img.jpg' });
    const { data, headers } = await axios.post('https://api.alfisy.my.id/api/tools/removebg', form, {
      headers: form.getHeaders(), responseType: 'arraybuffer', timeout: 60000
    });
    const buffer = Buffer.from(data);
    if (buffer.length < 100) return m.reply('❌ Gagal');
    conn.sendMessage(m.chat, { image: buffer, mimetype: headers['content-type'] || 'image/png', caption: '*BACKGROUND REMOVED*' }, { quoted: m });
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['removebg'];
handler.tags = ['tools'];
handler.command = /^(removebg|rbg)$/i;
handler.limit = 3;

export default handler;
