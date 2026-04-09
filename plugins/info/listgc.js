const handler = async (m, { conn }) => {
  const groups = Object.keys(global.db.data.chats).filter((j) => j.endsWith('@g.us'));
  if (!groups.length) return m.reply('Bot belum bergabung di grup manapun.');
  let text = `┌─⭓「 *LIST GROUP* 」\n│ Total: ${groups.length}\n│\n`;
  let i = 1;
  for (const jid of groups) {
    try {
      const meta = await conn.groupMetadata(jid);
      text += `│ ${i++}. ${meta.subject} (${meta.participants.length} member)\n`;
    } catch { text += `│ ${i++}. ${jid}\n`; }
  }
  text += `└───────────────⭓\n> ${global.wm}`;
  await m.reply(text);
};
handler.help    = ['listgc'];
handler.tags    = ['owner'];
handler.command = /^(listgc|listgroup|listgrup)$/i;
handler.owner   = true;
export default handler;
