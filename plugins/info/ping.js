import { performance } from 'perf_hooks';

const handler = async (m, { conn }) => {
  const start = performance.now();
  const msg   = await conn.sendMessage(m.chat, { text: '_Pinging…_' }, { quoted: m });
  const ping  = (performance.now() - start).toFixed(2);
  const used  = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  await conn.sendMessage(m.chat, {
    text: `┌─⭓「 *PING* 」\n│ *Speed :* ${ping} ms\n│ *RAM   :* ${used} MB\n└───────────────⭓\n> ${global.wm}`,
    edit: msg.key,
  });
};
handler.help    = ['ping'];
handler.tags    = ['info'];
handler.command = /^ping$/i;
export default handler;
