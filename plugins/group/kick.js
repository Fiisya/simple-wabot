const handler = async (m, { conn, isOwner, isAdmin, isBotAdmin }) => {
  if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
  if (!isBotAdmin)           return global.dfail('botAdmin', m, conn);

  // FIX: Helper untuk normalisasi JID
  const getJid = (raw) => conn.getJid ? conn.getJid(raw) : conn.decodeJid(raw);

  const ownerGroup = m.chat.split('-')[0] + '@s.whatsapp.net';
  let targets = [];

  // 1. Jika reply pesan
  if (m.quoted) {
    const rawJid = m.quoted.sender;
    const usr = getJid(rawJid); // Normalisasi
    if (usr === ownerGroup || usr === conn.user?.id || usr === m.chat) return m.reply('Tidak bisa kick itu!');
    targets.push(usr);
  }
  // 2. Jika mention
  else if (m.mentionedJid?.length) {
    targets = m.mentionedJid.map(u => getJid(u)).filter(u => u !== ownerGroup && !u.includes(conn.user?.id) && u !== m.chat);
  }

  if (!targets.length) return m.reply('Tag user atau reply pesan yang mau dikick!');

  // 3. Eksekusi Kick
  const kicked = [];
  for (const u of targets) {
    // Pastikan format JID valid (akhiri @s.whatsapp.net)
    const finalJid = u.endsWith('@s.whatsapp.net') ? u : (u.split('@')[0] + '@s.whatsapp.net');
    try {
      await conn.groupParticipantsUpdate(m.chat, [finalJid], 'remove');
      kicked.push(finalJid);
    } catch (e) {
      console.error('[Kick Error]', e);
    }
  }

  if (kicked.length > 0) {
    await m.reply(`✅ Berhasil kick @${kicked[0].split('@')[0]}`, { mentions: kicked });
  } else {
    m.reply('Gagal menendang user.');
  }
};
handler.help     = ['kick @user'];
handler.tags     = ['group'];
handler.command  = /^(kick|remove|tendang)$/i;
handler.group    = true;
handler.botAdmin = true;
export default handler;
