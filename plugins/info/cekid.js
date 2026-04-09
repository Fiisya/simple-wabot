const handler = async (m, { conn }) => {
  // Target dari mention atau quoted
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  
  // FIX: Normalisasi JID (hindari LID)
  const targetJid = conn.getJid ? conn.getJid(target) : conn.decodeJid(target);
  const targetNormal = targetJid.endsWith('@lid') ? target : targetJid;
  
  const name = await conn.getName(targetNormal);
  
  await conn.sendMessage(m.chat, {
    text: `┌─⭓「 *CEK ID* 」\n│ *Nama  :* ${name}\n│ *JID   :* ${targetNormal}\n│ *Nomor :* ${targetNormal.split('@')[0]}\n└───────────────⭓\n> ${global.wm}`,
    mentions: [targetNormal]
  }, { quoted: m });
};
handler.help    = ['cekid [@user]'];
handler.tags    = ['info'];
handler.command = /^(cekid|id|who)$/i;
export default handler;
