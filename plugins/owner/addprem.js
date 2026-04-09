const handler = async (m, { conn, args }) => {
  const jid = m.mentionedJid?.[0] || (args[0] ? args[0] + '@s.whatsapp.net' : null);
  if (!jid) return m.reply('Tag atau tulis nomor user!');
  const user = global.db.data.users[jid];
  if (!user) return m.reply('User belum terdaftar di database!');
  const duration = parseInt(args[1]) || 30;
  const exp = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID');
  user.premium     = true;
  user.premiumDate = exp;
  user.limit       = 'PERMANENT';
  await m.reply(`✅ Berhasil tambah premium\n*User:* @${jid.split('@')[0]}\n*Expired:* ${exp}`, { mentions: [jid] });
};
handler.help    = ['addprem @user [hari]'];
handler.tags    = ['owner'];
handler.command = /^(addprem|addpremium)$/i;
handler.owner   = true;
export default handler;
