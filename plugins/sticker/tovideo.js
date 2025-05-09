//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : sticker/tovideo


const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const {
    tmpdir
} = require('os');

let handler = async (m, {
    conn
}) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';

        if (!/webp/.test(mime)) return m.reply('Bukan stiker WebP!');
        if (!q.isAnimated) return m.reply('Stiker ini tidak bergerak (bukan animasi)!');

        const buffer = await q.download();
        const tempPath = path.join(tmpdir(), `${Date.now()}.webp`);
        fs.writeFileSync(tempPath, buffer);

        const {
            status,
            result,
            message
        } = await webp2mp4File(tempPath);
        fs.unlinkSync(tempPath); // Hapus file sementara

        if (!status) return m.reply(`Gagal mengubah ke video: ${message}`);

        await conn.sendFile(m.chat, result, 'sticker.mp4', '', m);
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan. Coba lagi nanti.');
    }
};

handler.help = ['tovideo', 'tovid'];
handler.tags = ['sticker'];
handler.command = /^(tovideo|tovid)$/i;
handler.limit = true;

async function webp2mp4File(filePath) {
    try {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', fs.createReadStream(filePath));

        const {
            data
        } = await axios.post('https://ezgif.com/webp-to-mp4', form, {
            headers: form.getHeaders(),
            timeout: 15000
        });

        const $ = cheerio.load(data);
        const file = $('input[name="file"]').val();
        if (!file) throw new Error('Gagal mendapatkan ID file dari Ezgif');

        const form2 = new FormData();
        form2.append('file', file);
        form2.append('convert', 'Convert WebP to MP4!');

        const {
            data: convertData
        } = await axios.post(`https://ezgif.com/webp-to-mp4/${file}`, form2, {
            headers: form2.getHeaders(),
            timeout: 15000
        });

        const $$ = cheerio.load(convertData);
        const result = $$('div#output > p.outfile > video > source').attr('src');
        if (!result) throw new Error('Gagal mendapatkan URL video dari Ezgif');

        return {
            status: true,
            message: 'Berhasil dikonversi',
            result: 'https:' + result
        };
    } catch (err) {
        console.error('webp2mp4File Error:', err);
        return {
            status: false,
            message: err.message || 'Gagal mengkonversi WebP ke MP4'
        };
    }
}

module.exports = handler;