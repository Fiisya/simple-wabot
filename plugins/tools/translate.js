import fetch from 'node-fetch';

const handler = async (m, { args, text }) => {
  const lang   = args[0] || 'id';
  const query  = m.quoted?.text || text.split(' ').slice(1).join(' ') || text;
  if (!query) return m.reply('Masukkan teks yang mau ditranslate!\nContoh: .translate en Halo dunia');

  await m.reply(global.wait);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(query)}`;
  const res  = await fetch(url);
  const data = await res.json();
  const result = data[0]?.map((x) => x?.[0]).filter(Boolean).join('') || 'Gagal translate';
  await m.reply(`🌐 *Translate → ${lang.toUpperCase()}*\n\n${result}`);
};
handler.help    = ['translate <lang> <teks>'];
handler.tags    = ['tools'];
handler.command = /^(translate|tr)$/i;
export default handler;
