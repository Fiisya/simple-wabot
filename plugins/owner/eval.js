import util from 'util';
const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    let result = eval(text);
    if (result instanceof Promise) result = await result;
    const out = util.inspect(result, { depth: null });
    await m.reply(out.length > 3000 ? out.slice(0, 3000) + '…' : out);
  } catch (e) {
    await m.reply(String(e));
  }
};
handler.help    = ['eval <code>'];
handler.tags    = ['owner'];
handler.command = /^(eval|=>)$/i;
handler.owner  = true;
export default handler;
