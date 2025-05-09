//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : game/family100-ans


const similarity = require('similarity')
const threshold = 0.72

module.exports = {
    async before(m, {
        conn
    }) {
        conn.family = conn.family || {}
        let id = m.chat
        if (!(id in conn.family)) return

        let room = conn.family[id]
        if (!room) return

        let text = m.text.toLowerCase().replace(/[^\w\s\-]+/g, '')

        if (text === 'nyerah') {
            let hasil = room.jawaban.map((j, i) => `(${i + 1}) ${j}`).join('\n')
            conn.reply(m.chat, `🛑 *Permainan Dihentikan!*\n\nJawaban:\n${hasil}`, room.msg)
            clearTimeout(room.timeout)
            delete conn.family[id]
            return !0
        }

        let index = room.jawaban.findIndex(j => j.toLowerCase() === text)
        if (index < 0) {
            if (Math.max(...room.jawaban.map((j, i) => !room.terjawab[i] ? similarity(j, text) : 0)) >= threshold) {
                m.reply('⚠️ Dikit lagi!')
            } else m.reply('❌ Salah!')
            return !0
        }

        if (room.terjawab[index]) return !0

        room.terjawab[index] = m.sender
        let users = global.db.data.users[m.sender]
        users.money = (users.money || 0) + room.rewardAmount

        let isWin = room.terjawab.every(Boolean)
        let teks = `
*Soal:* ${room.soal}
${isWin ? `\n🎉 *Semua jawaban telah ditemukan!*` : ''}

${room.jawaban.map((j, i) => {
    let status = room.terjawab[i]
    return status ? `(${i + 1}) ${j} ✅ @${status.split('@')[0]}` : false
}).filter(Boolean).join('\n')}

+${room.rewardAmount} kredit sosial tiap jawaban benar
        `.trim()

        if (conn.family[id].msg_old) {
            await conn.sendMessage(m.chat, {
                delete: conn.family[id].msg_old.key
            }).catch(() => {})
        }

        let msg_old = await m.reply(teks)
        conn.family[id].msg_old = msg_old

        if (isWin) {
            clearTimeout(room.timeout)
            setTimeout(() => {
                conn.sendMessage(m.chat, {
                    delete: conn.family[id].msg.key
                }).catch(() => {})
                delete conn.family[id]
            }, 10000)
        }

        return !0
    }
}