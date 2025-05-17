//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : sticker/wm


const crypto = require('crypto');
const webp = require('node-webpmux');

async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
    const img = new webp.Image();
    const stickerPackId = crypto.randomBytes(32).toString('hex');
    const json = {
        'sticker-pack-id': stickerPackId,
        'sticker-pack-name': packname,
        'sticker-pack-publisher': author,
        'emojis': categories,
        ...extra
    };
    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);

    await img.load(webpSticker);
    img.exif = exif;
    return await img.save(null);
}

const handler = async (m, {
    conn,
    text
}) => {
    if (!m.quoted) throw 'Balas sticker yang ingin diberi watermark!';
    let stiker = false;

    try {
        let [packname, ...author] = (text || '').split('|');
        author = (author || []).join('|');
        const mime = m.quoted.mimetype || '';
        if (!/webp/.test(mime)) throw 'Balas sticker dalam format .webp!';
        const img = await m.quoted.download();
        if (!img) throw 'Gagal mengunduh sticker!';

        stiker = await addExif(img, packname.trim() || '', author.trim() || '');
    } catch (e) {
        console.error(e);
        if (Buffer.isBuffer(e)) stiker = e;
    } finally {
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, {
                asSticker: true
            });
        } else {
            throw 'Gagal mengkonversi sticker!';
        }
    }
};

handler.help = ['wm <packname>|<author>'];
handler.tags = ['sticker'];
handler.command = /^wm$/i;
handler.premium = false;
handler.limit = 10;

module.exports = handler;