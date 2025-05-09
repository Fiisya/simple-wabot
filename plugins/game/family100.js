//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : game/family100


const fetch = require('node-fetch')

let winScore = 500
let rewardAmount = 100

let handler = async function(m, {
    conn
}) {
    conn.family = conn.family || {}
    let id = m.chat

    if (id in conn.family) {
        return conn.reply(m.chat, 'Masih ada kuis yang belum selesai!\nKetik *nyerah* untuk mengakhiri.', conn.family[id].msg)
    }

    let res = await fetch('https://api.siputzx.my.id/api/games/family100')
    let data = await res.json()

    if (!data.status) throw 'Gagal mengambil data dari API'

    let json = data.data
    let soal = json.soal
    let jawaban = json.jawaban

    let caption = `
*Family 100*

▢ *Soal:* ${soal}
▢ *Jumlah Jawaban:* ${jawaban.length}
${jawaban.find(v => v.includes(' ')) ? '▢ (Beberapa jawaban mengandung spasi)' : ''}
▢ +${rewardAmount} kredit sosial tiap jawaban benar
▢ Waktu: 3 Menit
▢ Ketik *nyerah* untuk menyerah
`.trim()

    conn.family[id] = {
        id,
        msg: await m.reply(caption),
        soal,
        jawaban,
        terjawab: Array.from(jawaban, () => false),
        winScore,
        rewardAmount,
        timeout: setTimeout(() => {
            if (conn.family[id]) {
                let hasil = conn.family[id].jawaban.map((j, i) => `(${i + 1}) ${j}`).join('\n')
                conn.reply(m.chat, `⏰ *Waktu Habis!*\nJawaban yang benar:\n${hasil}`, conn.family[id].msg)
                delete conn.family[id]
            }
        }, 180000)
    }
}

handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100$/i
handler.group = true

module.exports = handler