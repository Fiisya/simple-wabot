//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/mulaiabsen


let handler = async (m, {
    conn,
    usedPrefix,
    text
}) => {
    conn.absen = conn.absen ? conn.absen : {}
    let id = m.chat
    if (id in conn.absen) {
        throw `_*Masih ada absen di chat ini!*_\n\n*${usedPrefix}hapusabsen* - untuk menghapus absen`
    }
    conn.absen[id] = [
        m.reply(`Berhasil memulai absen!\n\n*${usedPrefix}absen* - untuk absen\n*${usedPrefix}cekabsen* - untuk mengecek absen\n*${usedPrefix}hapusabsen* - untuk menghapus data absen`),
        [],
        text
    ]
}
handler.help = ['mulaiabsen [teks]']
handler.tags = ['group']
handler.command = /^(start|mulai)absen$/i
handler.group = true
handler.admin = true
module.exports = handler;