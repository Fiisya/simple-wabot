//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/tourl


const fetch = require("node-fetch");
const crypto = require("crypto");
const FormData = require("form-data");
const {
    fromBuffer
} = require("file-type");
const axios = require("axios");
const fakeUserAgent = require("fake-useragent");
const cheerio = require("cheerio");
const fs = require('node:fs');

const randomBytes = crypto.randomBytes(5).toString("hex");

async function alfixdRaw(fileBuffer) {
    try {
        const form = new FormData();
        form.append('file', fileBuffer, {
            filename: 'upload.jpg'
        });

        const response = await fetch('https://upfilegh.alfiisyll.biz.id/upload', {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const htmlResponse = await response.text();
        const $ = cheerio.load(htmlResponse);
        const rawUrl = $('#rawUrlLink').attr('href');

        return rawUrl ? [{
            name: 'Alfixd',
            url: rawUrl
        }] : [];
    } catch (error) {
        console.error('Upload error:', error);
        return [];
    }
}

let handler = async (m, {
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m;
    if (!q) throw `kirim foto trus ketik .tourl \\ reply foto trus .tourl`;
    let mime = (q.msg || q).mimetype || "";

    if (/image|webp/.test(mime)) {
        let media = await (m.quoted ? m.quoted.download() : m.download());
        const {
            ext,
            mime
        } = await fromBuffer(media);
        let filename = '../../tmp/' + Date.now() + '.' + ext;
        fs.writeFileSync(filename, media);

        const uploadedLinks = await alfixdRaw(fs.readFileSync(filename));
        fs.unlinkSync(filename);

        if (uploadedLinks.length === 0) {
            return m.reply('Gagal mengunggah gambar.');
        }

        m.reply(`*乂 A L F I X D - U P L O A D E R*
  ◦ Size : ${Func.formatSize(media.length)}
  ◦ Url : ${uploadedLinks[0].url}

© Simple WhatsApp bot by Asyl`);
    } else if (/audio|video/.test(mime)) {
        let media = await (m.quoted ? m.quoted.download() : m.download());
        const {
            ext,
            mime
        } = await fromBuffer(media);
        let filename = '../../tmp/' + Date.now() + '.' + ext;
        fs.writeFileSync(filename, media);

        const uploadedLinks = await alfixdRaw(fs.readFileSync(filename));
        fs.unlinkSync(filename);

        if (uploadedLinks.length === 0) {
            return m.reply('Gagal mengunggah file.');
        }

        m.reply(uploadedLinks[0].url);
    } else {
        m.reply(`kirim foto trus ketik .tourl \\ reply foto trus .tourl`);
    }
};

handler.help = ["tourl", "upload"].map((a) => a + " *[reply/send media]*");
handler.tags = ["tools"];
handler.command = ["tourl", "upload"];

module.exports = handler;