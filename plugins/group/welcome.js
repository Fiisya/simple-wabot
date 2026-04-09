const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('❌ Command ini hanya bisa digunakan di grup!');
  
  // Cek admin
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;
  const userJid = conn.getJid ? conn.getJid(m.sender) : conn.decodeJid(m.sender);
  const user = participants.find((u) => conn.decodeJid(u.id) === userJid || conn.decodeJid(u.phoneNumber) === userJid);
  const isAdmin = user?.admin === 'admin' || user?.admin === 'superadmin';
  
  if (!isAdmin) return m.reply('❌ Command ini hanya untuk admin grup!');

  const chat = global.db.data.chats[m.chat] || {};
  
  // Parse on/off
  const isOn = args[0]?.toLowerCase();
  if (isOn === 'on') {
    chat.welcome = true;
    return m.reply('✅ Welcome message berhasil **diaktifkan**!\n\nStatus: **ON ✅**');
  } else if (isOn === 'off') {
    chat.welcome = false;
    return m.reply('✅ Welcome message berhasil **dinonaktifkan**!\n\nStatus: **OFF ❌**');
  }

  // Default ON jika belum diset
  chat.welcome = chat.welcome !== false;
  
  return m.reply(`┌─⭓「 *WELCOME* 」\n│\n│ Atur welcome message\n│\n│ *Status saat ini:* ${chat.welcome ? 'ON ✅' : 'OFF ❌'}\n│\n│ *Cara penggunaan:*\n│ • ${usedPrefix + command} on - Aktifkan welcome\n│ • ${usedPrefix + command} off - Nonaktifkan welcome\n│\n│ *Lihat juga:*\n│ • .setwelcome - Set custom pesan welcome\n│ • .setbye - Set custom pesan goodbye\n└───────────────⭓`);
};

handler.help = ['welcome <on/off>'];
handler.tags = ['group'];
handler.command = /^(welcome|onwelcome)$/i;
handler.group = true;
handler.admin = true;

export default handler;
