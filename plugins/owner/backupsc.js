import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const exec_ = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const rootDir = path.resolve(__dirname, '../../');
    const zipFileName = `kendev-backup-${Date.now()}.zip`;
    const zipPath = path.join(rootDir, zipFileName);

    await m.reply('📦 Sedang memulai proses backup...\nMohon tunggu beberapa saat...');

    // Buat zip file include session (exclude node_modules, tmp, .git)
    const zipCommand = `cd "${rootDir}" && zip -r "${zipPath}" . -x "node_modules/*" "tmp/*" ".git/*"`;

    await exec_(zipCommand);

    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);

      await m.reply(`✅ Backup berhasil!\n\n📋 Detail:\n> File: ${zipFileName}\n> Size: ${sizeInMB} MB\n\nSedang mengirim file...`);

      // Kirim ke WhatsApp
      await conn.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(zipPath),
          mimetype: 'application/zip',
          fileName: zipFileName,
          caption: `*BACKUP SCRIPT*\n\n📦 File: ${zipFileName}\n📊 Size: ${sizeInMB} MB\n🕐 Time: ${new Date().toLocaleString()}\n\n> ${global.wm}`,
        },
        { quoted: m }
      );

      // Hapus file setelah kirim
      setTimeout(() => {
        try {
          fs.unlinkSync(zipPath);
          m.reply('🗑️ File backup telah dihapus dari server.');
        } catch (e) {
          console.error('[Backup] Gagal hapus file:', e);
        }
      }, 10000);

    } else {
      await m.reply('❌ Gagal membuat file backup.');
    }

  } catch (error) {
    console.error('[Backup Error]', error);
    await m.reply(`❌ Terjadi kesalahan saat backup:\n${error.message}`);
  }
};

handler.help = ['backupsc'];
handler.tags = ['owner'];
handler.command = /^(backupsc|backup)$/i;
handler.rowner = true;

export default handler;
