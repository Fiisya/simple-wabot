const handler = async (m) => {
  global.selfMode = !global.selfMode;
  await m.reply(`✅ Mode self: ${global.selfMode ? '🔒 ON (hanya owner)' : '🌐 OFF (publik)'}`);
};
handler.help    = ['self'];
handler.tags    = ['owner'];
handler.command = /^(self|public)$/i;
handler.rowner  = true;
export default handler;
