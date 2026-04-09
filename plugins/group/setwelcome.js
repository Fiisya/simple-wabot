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
    return m.reply(`┌─⭓「 *SET WELCOME* 」\n│\n│ Set pesan welcome untuk grup\n│\n│ *Placeholder yang tersedia:*\n│ • @user - Tag member baru\n│ • @group - Nama grup\n│ • @member - Jumlah member\n│ • @waktu - Waktu join\n│ • @desc - Deskripsi grup\n│\n│ *Contoh:*\n│ ${usedPrefix + command} Selamat datang @user di grup @group!\n└───────────────⭓`);
  }

  chat.sWelcome = text;
  await m.reply(`✅ Pesan welcome berhasil diset!\n\n*Pesan:*\n${text}`);
};

handler.help = ['setwelcome <teks>'];
handler.tags = ['group'];
handler.command = /^(setwelcome)$/i;
handler.group = true;
handler.admin = true;

export default handler;
