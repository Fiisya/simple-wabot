//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : sticker/sticker-wm


let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/video/g.test(mime))
        if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
    try {
        let img = await q.download()

        if (!img) throw `balas gambar/video/stiker dengan perintah .stiker`
        conn.sendImageAsSticker(m.chat, img, m, {
            packname: text,
            author: ''
        })
    } catch {
        throw 'Gagal!, Balas Gambar/video dengan caption *.stiker*'
    }
}
handler.help = ['watermark']
handler.tags = ['sticker']
handler.command = /^wm|watermark?$/i

module.exports = handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}