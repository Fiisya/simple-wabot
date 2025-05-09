//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/rvo


let handler = async (m, {
    conn
}) => {
    try {
        if (!m.quoted) throw 'Reply pesan view-once yang ingin Anda lihat'
        if (!m.quoted.viewOnce) throw 'Itu bukan pesan view-once'
        await conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        })
        let buffer = await m.quoted.download()
        let type = m.quoted.mtype
        let caption = m.quoted.text || ''
        if (/image/.test(type)) {
            return conn.sendFile(m.chat, buffer, 'image.jpg', caption, m)
        } else if (/video/.test(type)) {
            return conn.sendFile(m.chat, buffer, 'video.mp4', caption, m)
        } else if (/audio/.test(type) && m.quoted.ptt) {
            return conn.sendFile(m.chat, buffer, 'voice.ogg', '', m, true, {
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            })
        } else {
            throw 'Pesan ini bukan gambar, video, atau voice note (vn)'
        }
    } catch (err) {
        m.reply(`Terjadi kesalahan: ${err.message || err}`)
    }
}

handler.help = ['readvo']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'rvo', 'liat', 'readvo']
handler.limit = true

module.exports = handler