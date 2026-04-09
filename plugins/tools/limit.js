const handler = async (m) => {
  const user  = global.db.data.users[m.sender];
  const limit = user?.limit ?? 100;
  const isPerm = limit === 'PERMANENT';
  await m.reply(
    `┌─⭓「 *LIMIT* 」\n│ *Limit :* ${isPerm ? '∞ Unlimited' : limit}\n│ *Reset :* Setiap 24 jam\n└───────────────⭓\n> ${global.wm}`
  );
};
handler.help    = ['limit'];
handler.tags    = ['info'];
handler.command = /^(limit|ceklimit)$/i;
export default handler;
