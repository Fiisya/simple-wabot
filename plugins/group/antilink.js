const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Contoh:\n${usedPrefix + command} on/off`);
  const chat = global.db.data.chats[m.chat];
  const isOn = args[0].toLowerCase() === 'on';

  chat.antilink = isOn;
  m.reply(`✅ Antilink berhasil di${isOn ? 'aktifkan' : 'nonaktifkan'}.`);
};

handler.before = async (m, { conn, isBotAdmin, isAdmin, isOwner }) => {
  if (!m.isGroup || !global.db.data.chats[m.chat]?.antilink || isAdmin || isOwner || !isBotAdmin) return;

  if (/chat\.whatsapp\.com/i.test(m.text)) {
    await conn.sendMessage(m.chat, { delete: m.key });
    
    // FIX: Normalisasi JID untuk menghindari LID
    const senderJid = conn.getJid ? conn.getJid(m.sender) : conn.decodeJid(m.sender);
    const senderNormal = senderJid.endsWith('@lid') ? m.sender : senderJid;
    const senderNum = senderNormal.split('@')[0];
    
    await conn.sendMessage(m.chat, { text: `⚠️ @${senderNum} dilarang mengirim link grup!`, mentions: [senderNormal] });
  }
};

handler.help = ['antilink on/off'];
handler.tags = ['group'];
handler.command = /^(antilink)$/i;
handler.group = true;
handler.admin = true;

export default handler;
