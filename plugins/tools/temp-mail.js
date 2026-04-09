import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const sub = text?.toLowerCase();

  if (!sub || sub === 'create') {
    m.reply(global.wait);
    try {
      const res = await alfisy('/api/tools/temp-mail', { action: 'generate' });
      if (!res?.status) return m.reply('❌ Gagal');
      global.db.data.users[m.sender].tempmail = { email: res.email, token: res.token };
      m.reply(`*TEMP MAIL*\nEmail: ${res.email}\n\nCek inbox: ${usedPrefix + command} inbox`);
    } catch (e) { m.reply(`❌ Error: ${e.message}`); }
    return;
  }

  if (sub === 'inbox') {
    m.reply(global.wait);
    try {
      const tm = global.db.data.users[m.sender]?.tempmail;
      if (!tm?.token) return m.reply(`❌ Belum punya email. Buat: ${usedPrefix + command} create`);
      const res = await alfisy('/api/tools/temp-mail', { action: 'inbox', token: tm.token });
      if (!res?.status) return m.reply('❌ Gagal');
      const msgs = res.messages || [];
      if (!msgs.length) return m.reply(`*INBOX*\nEmail: ${tm.email}\nKosong`);
      
      let txt = `*INBOX* (${msgs.length} pesan)\nEmail: ${tm.email}\n\n`;
      msgs.slice(0, 5).forEach((msg, i) => {
        txt += `${i + 1}. *${msg.subject}*\nFrom: ${msg.from}\n${msg.bodyPreview || '-'}\n\n`;
      });
      m.reply(txt);
    } catch (e) { m.reply(`❌ Error: ${e.message}`); }
  }
};

handler.help = ['tempmail'];
handler.tags = ['tools'];
handler.command = /^(tempmail|tmail)$/i;
handler.limit = 1;

export default handler;
