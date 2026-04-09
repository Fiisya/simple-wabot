import { exec } from 'child_process';
const handler = async (m, { text }) => {
  if (!text) return m.reply('Masukkan perintah!');
  exec(text, async (err, stdout, stderr) => {
    const out = err ? String(err) : (stdout || stderr || '(no output)');
    await m.reply(out.length > 3000 ? out.slice(0, 3000) + '…' : out);
  });
};
handler.help    = ['exec <cmd>'];
handler.tags    = ['owner'];
handler.command = /^(exec|\$)$/i;
handler.owner  = true;
export default handler;
