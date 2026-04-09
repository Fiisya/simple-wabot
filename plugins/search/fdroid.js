import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} termux`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/fdroid', { q: text });
    if (!res?.success) return m.reply('❌ Gagal mencari');

    const apps = res.results || [];
    if (!apps.length) return m.reply('❌ Aplikasi tidak ditemukan');

    let txt = `*F-DROID* (${apps.length} hasil)\nQuery: ${text}\n\n`;
    apps.slice(0, 8).forEach((a, i) => {
      txt += `${i + 1}. *${a.name}* (v${a.version})\n📝 ${a.summary}\n🔗 ${a.apkUrl}\n\n`;
    });

    const first = apps[0];
    if (first?.icon) {
      try {
        const buf = await downloadFile(first.icon);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

handler.help = ['fdroid <query>'];
handler.tags = ['search'];
handler.command = /^(fdroid|fd)$/i;
handler.limit = 1;

export default handler;
