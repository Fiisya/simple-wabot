const handler = async (m, { conn, args }) => {
  const jid = m.mentionedJid?.[0] || (args[0] ? args[0] + '@s.whatsapp.net' : null);
  if (!jid) return m.reply('Tag atau tulis nomor user!');
  const user = global.db.data.users[jid];
  if (!user) return m.reply('User belum terdaftar!');
  user.banned = !user.banned;
  await m.reply(`✅ User @${jid.split('@')[0]} sekarang ${user.banned ? '🚫 BANNED' : '✅ UNBANNED'}`, { mentions: [jid] });
};
handler.help    = ['ban @user'];
handler.tags    = ['owner'];
handler.command = /^(ban|unban)$/i;
handler.owner   = true;
export default handler;
