const groupLinkRe = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

const before = async function (m, { conn, isBotAdmin, isAdmin, isOwner }) {
  if (!m.isGroup) return false;
  if (m.isBaileys || m.fromMe) return false;
  const chat = global.db.data.chats[m.chat] || {};
  if (!chat.antilink) return false;
  if (isAdmin || isOwner) return false;

  const text = m.text || '';
  if (!groupLinkRe.test(text)) return false;

  await m.reply('⚠️ Dilarang mengirim link grup!');
  if (isBotAdmin)
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  await conn.sendMessage(m.chat, { delete: m.key });
  return true;
};

const handler = Object.assign(() => {}, { before });
export default handler;
