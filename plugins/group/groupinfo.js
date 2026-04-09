import axios from 'axios';
import { downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, participants, groupMetadata }) => {
  const parts = participants || (await conn.groupMetadata(m.chat)).participants;

  // FIX: Fungsi helper untuk mendapatkan JID normal (bukan LID)
  // Kita prioritaskan `phoneNumber` karena ini selalu JID normal
  const getCleanJid = (rawId) => {
    if (!rawId) return null;
    const p = parts.find(u => u.id === rawId || u.phoneNumber?.includes(rawId));
    return p?.phoneNumber || rawId;
  };

  const admins = parts.filter(p => p.admin);
  const ownerRaw = groupMetadata.owner || admins.find(p => p.admin === 'superadmin')?.id;
  const owner = getCleanJid(ownerRaw);
  
  // FIX: List admin pakai JID normal (phoneNumber)
  const adminList = admins.map((v, i) => {
    const jid = v.phoneNumber || v.id;
    return `${i + 1}. @${jid.split('@')[0]}`;
  }).join('\n');

  let txt = `*「 Group Information 」*\n`;
  txt += `*ID:* ${groupMetadata.id}\n`;
  txt += `*Name:* ${groupMetadata.subject}\n`;
  txt += `*Description:* ${groupMetadata.desc?.toString() || 'unknown'}\n`;
  txt += `*Total Members:* ${parts.length} Members\n`;
  txt += `*Group Owner:* @${owner ? owner.split('@')[0] : 'Unknown'}\n`;
  txt += `*Group Admins:*\n${adminList || 'Tidak ada'}\n\n`;
  txt += `*Settings:*\n`;
  
  const chat = global.db.data.chats[m.chat] || {};
  txt += `${chat.welcome ? '✅' : '❌'} Welcome\n`;
  txt += `${chat.detect ? '✅' : '❌'} Detect\n`;
  txt += `${chat.antilink ? '✅' : '❌'} Antilink\n`;
  txt += `${chat.antidelete ? '✅' : '❌'} Antidelete\n`;
  txt += `${chat.mute ? '✅' : '❌'} Mute\n`;

  // FIX: Pastikan array mentions juga pakai JID normal
  const adminJids = admins.map(v => v.phoneNumber || v.id);
  const allMentions = [...new Set(owner ? [...adminJids, owner] : adminJids)];

  // Kirim dengan conn.sendMessage agar mentions terpasang sempurna
  const ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(() => null);
  
  if (ppUrl) {
    try {
      const buf = await downloadFile(ppUrl);
      await conn.sendMessage(m.chat, { image: buf, caption: txt, mentions: allMentions }, { quoted: m });
      return;
    } catch {}
  }
  
  // Fallback jika gambar gagal
  await conn.sendMessage(m.chat, { text: txt, mentions: allMentions }, { quoted: m });
};

handler.help = ['groupinfo'];
handler.tags = ['group'];
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i;
handler.group = true;

export default handler;
