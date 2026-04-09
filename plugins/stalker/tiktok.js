import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} salmancaesar`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/stalker/tiktok', { username: text });
    if (!res?.success) return m.reply('❌ Gagal mengambil data');

    const u = res.result?.user || {};
    const s = res.result?.stats || res.result?.statsV2 || {};

    const txt = `*TIKTOK STALKER*\n👤 @${u.uniqueId || text}\n📛 ${u.nickname || '-'}\n✅ Verified: ${u.verified ? 'Ya' : 'Tidak'}\n🔒 Private: ${u.privateAccount ? 'Ya' : 'Tidak'}\n\n📊 *Stats*\n👥 Followers: ${(s.followerCount || 0).toLocaleString()}\n➡️ Following: ${(s.followingCount || 0).toLocaleString()}\n❤️ Likes: ${(s.heartCount || 0).toLocaleString()}\n🎬 Videos: ${s.videoCount || 0}\n\n🔗 ${u.bioLink?.link || '-'}`;

    if (u.avatarThumb) {
      try {
        const buf = await downloadFile(u.avatarThumb);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['ttstalk <username>'];
handler.tags = ['stalker'];
handler.command = /^(ttstalk|tiktokstalk|ttstalker)$/i;
handler.limit = 1;

export default handler;
