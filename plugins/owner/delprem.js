const handler = async (m, { conn, args }) => {
  const jid = m.mentionedJid?.[0] || (args[0] ? args[0] + '@s.whatsapp.net' : null);
  if (!jid) return m.reply('Tag atau tulis nomor user!');
  const user = global.db.data.users[jid];
  if (!user) return m.reply('User belum terdaftar!');
  user.premium     = false;
  user.premiumDate = '';
  user.limit       = 100;
  await m.reply(`✅ Berhasil hapus premium\n*User:* @${jid.split('@')[0]}`, { mentions: [jid] });
};
handler.help    = ['delprem @user'];
handler.tags    = ['owner'];
handler.command = /^(delprem|delpremium|unprem)$/i;
handler.owner   = true;
export default handler;
