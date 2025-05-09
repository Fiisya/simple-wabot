//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : downloader/terabox


//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : downloader/terabox


const fetch = require('node-fetch');

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `*🚩 Contoh:* ${usedPrefix}${command} https://terabox.com/s/1aD9T7_Xe0oroBwlfzyWXUA`;

    if (!text.match(/terabox\.com|1024tera\.com|4funbox\.com/i)) {
        throw 'Mohon masukkan URL Terabox yang valid.';
    }

    await m.reply('⏳ Mohon tunggu, sedang memproses...');

    try {
        const response = await fetch(`https://fastrestapis.fasturl.cloud/downup/teraboxdown?url=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (!data || data.status !== 200 || !data.result || data.result.length === 0) {
            throw 'Tidak ada file ditemukan atau respons tidak valid dari server.';
        }

        /* let msg = `乂 *T E R A B O X   D O W N L O A D E R*\n\n`;
         msg += `Ditemukan ${data.result.length} file:\n\n`;

         for (let file of data.result) {
             msg += ` sedang mengirim... ${file.filename}`;            
         }

         await conn.sendMessage(m.chat, {
             text: msg,
             contextInfo: {
                 externalAdReply: {
                     title: 'Terabox Downloader',
                     body: `Memproses ${data.result.length} file`,
                     thumbnailUrl: 'https://pomf2.lain.la/f/ihnv9wct.jpg',
                     sourceUrl: null,
                     mediaType: 1,
                     renderLargerThumbnail: false
                 }
             }
         }); */

        for (let i = 0; i < data.result.length; i++) {
            const file = data.result[i];
            const mime = getMimeType(file.filename);

            try {
                await conn.sendFile(
                    m.chat,
                    file.downloadUrl,
                    file.filename,
                    `*Title:* ${file.filename}\n*Size:* ${formatSize(file.size)}\n*Created at:* ${formatDate(file.create_time)}\n\n`,
                    m,
                    false, {
                        mimetype: mime
                    }
                );

                if (i < data.result.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            } catch (error) {
                console.error('Gagal mengunduh file:', error);
                await conn.reply(m.chat, `Gagal mengunduh file: ${file.filename}`, m);
            }
        }

    } catch (error) {
        console.error('Error:', error);
        throw 'Gagal memproses tautan Terabox. Coba lagi nanti.';
    }
};

handler.help = ['teraboxdl'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(teraboxdl|terabox)$/i;
handler.limit = true;
handler.premium = true;

module.exports = handler;

// === UTILITIES ===

function getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
        'mp4': 'video/mp4',
        'mp3': 'audio/mpeg',
        'pdf': 'application/pdf',
        'zip': 'application/zip',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'txt': 'text/plain',
        'doc': 'application/msword',
        'xls': 'application/vnd.ms-excel'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

function formatSize(bytes) {
    if (isNaN(bytes)) return 'Ukuran tidak diketahui';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

function formatDate(timestamp) {
    try {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Tanggal tidak diketahui';
    }
}