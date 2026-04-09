const handler = async (m, { conn, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
  const inv = await conn.groupInviteCode(m.chat);
  await m.reply(`🔗 *Link Group*\nhttps://chat.whatsapp.com/${inv}`);
};
handler.help     = ['link'];
handler.tags     = ['group'];
handler.command  = /^link$/i;
handler.group    = true;
handler.botAdmin = true;
export default handler;
