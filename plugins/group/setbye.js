const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('❌ Command ini hanya bisa digunakan di grup!');
  
  // Cek admin
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;
  const userJid = conn.getJid ? conn.getJid(m.sender) : conn.decodeJid(m.sender);
  const user = participants.find((u) => conn.decodeJid(u.id) === userJid || conn.decodeJid(u.phoneNumber) === userJid);
  const isAdmin = user?.admin === 'admin' || user?.admin === 'superadmin';
  
  if (!isAdmin) return m.reply('❌ Command ini hanya untuk admin grup!');

  const chat = global.db.data.chats[m.chat] || {};
  
  if (!text) {
    return m.reply(`┌─⭓「 *SET BYE* 」\n│\n│ Set pesan goodbye untuk grup\n│\n│ *Placeholder yang tersedia:*\n│ • @user - Tag member\n│ • @group - Nama grup\n│ • @member - Jumlah member\n│ • @waktu - Waktu leave\n│ • @desc - Deskripsi grup\n│\n│ *Contoh:*\n│ ${usedPrefix + command} Selamat tinggal @user dari grup @group!\n└───────────────⭓`);
  }

  chat.sBye = text;
  await m.reply(`✅ Pesan goodbye berhasil diset!\n\n*Pesan:*\n${text}`);
};

handler.help = ['setbye <teks>'];
handler.tags = ['group'];
handler.command = /^(setbye)$/i;
handler.group = true;
handler.admin = true;

export default handler;
