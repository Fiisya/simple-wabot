import fetch from 'node-fetch';

const handler = async (m, { text }) => {
  if (!text) return m.reply('Masukkan URL!\nContoh: .tinyurl https://example.com');
  await m.reply(global.wait);
  try {
    const res  = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`);
    const data = await res.text();
    await m.reply(`🔗 *URL Pendek*\n${data}`);
  } catch {
    await m.reply('Gagal mempersingkat URL!');
  }
};
handler.help    = ['tinyurl <url>'];
handler.tags    = ['tools'];
handler.command = /^(tinyurl|short|shorturl)$/i;
export default handler;
