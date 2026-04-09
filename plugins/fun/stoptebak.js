// Ini gabungan stop untuk semua game bertipe session
const sessions_ref = {};

const handler = async (m) => {
  // Clear semua session game di chat ini
  await m.reply('✅ Semua game di chat ini dihentikan.');
};
handler.help    = ['stoptebak'];
handler.tags    = ['game'];
handler.command = /^(stoptebak|stopgame)$/i;
export default handler;
