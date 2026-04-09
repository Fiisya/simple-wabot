const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan teks broadcast!');
  const chats = Object.keys(global.db.data.chats);
  let sukses = 0, gagal = 0;
  for (const jid of chats) {
    try {
      await conn.sendMessage(jid, { text: `📢 *BROADCAST*\n\n${text}\n\n> ${global.wm}` });
      sukses++;
      await new Promise((r) => setTimeout(r, 1000));
    } catch { gagal++; }
  }
  await m.reply(`✅ Broadcast selesai\n*Sukses:* ${sukses}\n*Gagal:* ${gagal}`);
};
handler.help    = ['bc <pesan>'];
handler.tags    = ['owner'];
handler.command = /^(bc|broadcast)$/i;
handler.rowner  = true;
export default handler;
