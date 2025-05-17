//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : game/susunkata


let fetch = require('node-fetch')

let timeout = 100000
let money = 10000
let handler = async (m, {
    conn,
    usedPrefix
}) => {
    conn.susun = conn.susun ? conn.susun : {}
    let id = m.chat
    if (id in conn.susun) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susun[id][0])
        throw false
    }
    // Fetch data from the new API endpoint
    let res = await fetch('https://api.siputzx.my.id/api/games/susunkata')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.status) throw json
    let data = json.data

    // Create caption for WhatsApp
    let caption = `
${data.soal}

┌─⊷ *SOAL*
▢ Tipe: ${data.tipe}
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}susn untuk bantuan
▢ Bonus: ${money} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim()
    conn.susun[id] = [
        await conn.reply(m.chat, caption, m),
        data, money,
        setTimeout(() => {
            if (conn.susun[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${data.jawaban}*`, conn.susun[id][0])
            delete conn.susun[id]
        }, timeout)
    ]
}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = /^susunkata/i
handler.register = false
handler.group = false

module.exports = handler