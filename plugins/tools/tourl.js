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
const uloadUrlRegexStr = /url: "([^"]+)"/;
const randomBytes = crypto.randomBytes(5).toString("hex");
const fs = require('node:fs')

let handler = async (m, {
    usedPrefix,
    command
}) => {

    let q = m.quoted ? m.quoted : m;
    if (!q) throw `kirim foto trus ketik .tourl \\ reply foto trus .tourl`;
    let mime = (q.msg || q).mimetype || "";
    if (/image|webp/.test(mime)) {

        let media = await (m.quoted ? m.quoted.download() : m.download())

        const {
            ext,
            mime
        } = await fromBuffer(media)

        let filename = '../../tmp/' + Date.now() + '.' + ext;
        fs.writeFileSync(filename, media);
        const {
            uploadedLinks
        } = await Telegraph(filename)
        fs.unlinkSync(filename);
        m.reply(`*乂 T E L E G R A - P H - U P L O A D E R*
  ◦ Size : ${Func.formatSize(media.length)}
  ◦ Url : ${uploadedLinks[0]}

© Simple WhatsApp bot by Asyl`)
    } else if (/audio|video/.test(mime)) {

        let media = await (m.quoted ? m.quoted.download() : m.download())

        const {
            ext,
            mime
        } = await fromBuffer(media)
        let filename = '../../tmp/' + Date.now() + '.' + ext;
        fs.writeFileSync(filename, media);
        let formData = new FormData();
        formData.append('file', fs.createReadStream(filename));
        formData.append('expirationOption', 'permanent');

        let res = await fetch('https://Nauval.mycdn.biz.id/upload', {
            method: 'POST',
            body: formData
        })

        let json = await res.json();

        fs.unlinkSync(filename);
        m.reply(json.fileUrl)
    } else {
        m.reply(`kirim foto trus ketik .tourl \\ reply foto trus .tourl`);
    }
}

handler.help = ["tourl", "upload"].map((a) => a + " *[reply/send media]*");
handler.tags = ["tools"];
handler.command = ["tourl", "upload"];

module.exports = handler;

const createFormData = (content, fieldName, ext) => {
    const {
        mime
    } = fromBuffer(content) || {};
    const formData = new FormData();
    formData.append(fieldName, content, `${randomBytes}.${ext}`);
    return formData;
};

const Telegraph = async (path) => {
    try {
        let d = new FormData();
        d.append("images", fs.createReadStream(path));

        let h = {
            headers: {
                ...d.getHeaders()
            }
        }

        let {
            data: uploads
        } = await axios.post("https://telegraph.zorner.men/upload", d, h);
        return {
            uploadedLinks: uploads.links
        }
    } catch (e) {
        console.error(e.message)
    }
}