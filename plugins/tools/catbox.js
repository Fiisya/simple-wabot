//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/catbox


const fetch = require('node-fetch');
const FormData = require('form-data');

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    if (!m || !m.chat || !m.key) {
        return m.reply('Error: Invalid message context');
    }

    var q = m.quoted ? m.quoted : m;
    var mime = (q.msg || q).mimetype || q.mediaType || '';

    if ((/image|video/.test(mime)) && !/webp/.test(mime)) {
        await conn.sendMessage(m.chat, {
            react: {
                text: '🕒',
                key: m.key,
            }
        });

        try {
            const media = await q.download?.();
            if (!media) {
                throw new Error('Failed to download media');
            }

            const fileSizeInBytes = media.length;
            const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
            const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
            const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`;

            const form = new FormData();
            form.append('reqtype', 'fileupload');

            let ext = '';
            if (mime.includes('video')) ext = '.mp4';
            else if (mime.includes('jpeg')) ext = '.jpg';
            else if (mime.includes('png')) ext = '.png';
            else ext = '';

            form.append('fileToUpload', media, `file${ext}`);

            let res = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: form
            });

            let result = await res.text();
            let url = result.trim();
            let caption = `🔗 URL: ${url}\n\n*Ukuran:* ${fileSize}`;

            await conn.sendMessage(m.chat, {
                text: caption
            }, {
                quoted: m
            });
        } catch (e) {
            console.error('Error:', e.stack);
            m.reply(`[ ! ] Gagal mengunggah file. Error: ${e.message}`);
        }
    } else {
        m.reply(`Kirim gambar/video dengan caption *${usedPrefix + command}* atau reply media yang sudah dikirim`);
    }
};

handler.help = ['catbox'];
handler.command = ['catbox'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = true;
handler.register = true;

module.exports = handler;