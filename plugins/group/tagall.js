const handler = async (m, { conn, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);
  const meta    = await conn.groupMetadata(m.chat);
  const members = meta.participants.map((p) => p.id);
  const text    = m.text || `📢 *Tag All Member* ${meta.subject}`;
  const mentions = members.map((j) => `@${j.split('@')[0]}`).join(' ');
  await conn.sendMessage(m.chat, { text: `${text}\n\n${mentions}`, mentions: members }, { quoted: m });
};
handler.help    = ['tagall'];
handler.tags    = ['group'];
handler.command = /^(tagall|tgall|tag)$/i;
handler.group   = true;
export default handler;
