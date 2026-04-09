import moment from 'moment-timezone';
import os from 'os';

const handler = async (m, { conn, isOwner, isPrems, isMods }) => {
  const time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
  const date = global.tanggal(Date.now());
  const role = isOwner ? '👑 Owner' : isMods ? '🛡️ Moderator' : isPrems ? '💎 Premium' : '👤 Member';
  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const min = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);

  const cats = {};
  for (const name in global.plugins) {
    const p = global.plugins[name];
    if (!p?.command || !p?.tags?.length) continue;
    const tag = p.tags[0];
    cats[tag] = cats[tag] || [];
    const cmd = Array.isArray(p.help) ? p.help[0] : (p.help || String(p.command).replace(/[\/^$*?()|[\]\\]/g,''));
    cats[tag].push(cmd);
  }

  let menuText = `┌─⭓「 *${global.namebot}* 」\n`;
  menuText    += `│ *Waktu  :* ${time}\n`;
  menuText    += `│ *Tanggal:* ${date}\n`;
  menuText    += `│ *Role   :* ${role}\n`;
  menuText    += `│ *Uptime :* ${h}j ${min}m ${s}s\n`;
  menuText    += `└───────────────⭓\n\n`;

  for (const [cat, cmds] of Object.entries(cats)) {
    menuText += `*◈ ${global.capitalize(cat)}*\n`;
    menuText += cmds.map((c) => `  ╰ .${c}`).join('\n') + '\n\n';
  }
  menuText += `> ${global.wm}`;

  await conn.sendMessage(
    m.chat,
    {
      text: menuText,
      contextInfo: {
        externalAdReply: {
          title: global.namebot,
          body: `v${global.version} by ${global.author}`,
          thumbnailUrl: global.thumb,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    },
    { quoted: m }
  );
};
handler.help    = ['menu', 'help'];
handler.tags    = ['info'];
handler.command = /^(menu|help|start|halo|hi)$/i;
export default handler;
