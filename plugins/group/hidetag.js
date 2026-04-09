import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  const teks = text || m.quoted?.text || m.quoted?.caption || '';
  const mention = { mentions: participants.map(u => u.id) };
  const fkontak = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { conversation: '' }
  };

  const mime = m.mtype || m.quoted?.mtype || '';
  const source = m.mtype ? m : m.quoted;

  if (/image|video|audio|sticker|document/.test(mime) && source) {
    const buf = await source.download();
    const type = mime.split('/')[0] === 'sticker' ? 'sticker' : mime.split('/')[0];
    const opts = { [type]: buf, ...mention };
    if (/image|video|document/.test(mime)) opts.caption = teks;
    if (/audio/.test(mime)) { opts.mimetype = 'audio/mpeg'; opts.ptt = false; }
    return conn.sendMessage(m.chat, opts, { quoted: fkontak });
  }

  conn.sendMessage(m.chat, { text: teks, ...mention }, { quoted: fkontak });
};

handler.help = ['hidetag <text/media>'];
handler.tags = ['group'];
handler.command = /^(hidetag|hio|tag)$/i;
handler.group = true;
handler.admin = true;

export default handler;
