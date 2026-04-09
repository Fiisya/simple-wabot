import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://github.com/Fiisya/simple-wabot`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/download/github-url', { url: text });
    if (!res?.success) return m.reply('❌ Gagal mengambil data');

    const { owner, repo, branch, download_url } = res;
    const fileName = `${repo}-${branch}.zip`;

    m.reply(`📥 Downloading ${fileName}...`);
    const zip = await downloadFile(download_url);

    conn.sendMessage(m.chat, {
      document: zip,
      fileName,
      mimetype: 'application/zip',
      caption: `*GITHUB DOWNLOAD*\n📦 ${owner}/${repo}\n🌿 Branch: ${branch}\n📁 Size: ${(zip.length / 1024 / 1024).toFixed(2)} MB`
    }, { quoted: m });
  } catch (e) {
    console.error('[GHDL Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['ghdl <url>'];
handler.tags = ['downloader'];
handler.command = /^(ghdl|githubdl)$/i;
handler.limit = 1;

export default handler;
