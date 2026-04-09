const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('Reply pesan yang mau dihapus!');
  if (!m.quoted.fromMe) return m.reply('Hanya bisa hapus pesan bot!');
  await conn.sendMessage(m.chat, { delete: m.quoted.key });
};
handler.help    = ['del'];
handler.tags    = ['tools'];
handler.command = /^(del|delete|hapus)$/i;
export default handler;
