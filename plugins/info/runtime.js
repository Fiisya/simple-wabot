const handler = async (m) => {
  const uptime = process.uptime();
  const h   = Math.floor(uptime / 3600);
  const min = Math.floor((uptime % 3600) / 60);
  const s   = Math.floor(uptime % 60);
  await m.reply(`┌─⭓「 *RUNTIME* 」\n│ *Uptime :* ${h} jam ${min} menit ${s} detik\n└───────────────⭓\n> ${global.wm}`);
};
handler.help    = ['runtime'];
handler.tags    = ['info'];
handler.command = /^(runtime|uptime)$/i;
export default handler;
