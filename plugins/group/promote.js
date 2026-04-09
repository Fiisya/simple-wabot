const handler = async (m, { conn, isOwner, isAdmin, isBotAdmin }) => {
  if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
  if (!isBotAdmin)           return global.dfail('botAdmin', m, conn);
  const users = m.mentionedJid?.length ? m.mentionedJid : (m.quoted ? [m.quoted.sender] : []);
  if (!users.length) return m.reply('Tag/quote user yang mau dipromote!');
  for (const u of users) await conn.groupParticipantsUpdate(m.chat, [u], 'promote');
  await m.reply(`✅ Berhasil promote ${users.length} user`);
};
handler.help     = ['promote @user'];
handler.tags     = ['group'];
handler.command  = /^(promote|jadmin|admin)$/i;
handler.group    = true;
handler.botAdmin = true;
export default handler;
