const fetch = require('node-fetch')
const similarity = require('similarity')

const timeout = 180000
const poin = 500
const threshold = 0.72

let handler = async function (m, { conn, usedPrefix, command }) {
    conn.tebakkimia = conn.tebakkimia || {}
    let id = m.chat

    switch (command) {
        case 'tebakkimia':
            if (id in conn.tebakkimia)
                return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id].msg)

            try {
                let res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json')
                let data = await res.json()
                let json = data[Math.floor(Math.random() * data.length)]

                let caption = `
Nama unsur dari lambang *${json.lambang}* adalah...

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}teki* untuk bantuan
Bonus: *${poin} XP*
`.trim()

                let msg = await conn.reply(m.chat, caption, m)
                conn.tebakkimia[id] = {
                    msg,
                    soal: json,
                    exp: poin,
                    timeout: setTimeout(() => {
                        if (conn.tebakkimia[id]) {
                            conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.unsur}*`, conn.tebakkimia[id].msg)
                            delete conn.tebakkimia[id]
                        }
                    }, timeout)
                }
            } catch (e) {
                console.error(e)
                conn.reply(m.chat, 'Gagal mengambil soal.', m)
            }
            break

        case 'teki':
            if (!(id in conn.tebakkimia)) return conn.reply(m.chat, 'Tidak ada soal aktif di chat ini', m)
            let jawab = conn.tebakkimia[id].soal.unsur
            let hint = jawab.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '_')
            m.reply('```' + hint + '```')
            break
    }
}

handler.before = async function (m, { conn }) {
    conn.tebakkimia = conn.tebakkimia || {}
    let id = m.chat
    if (!(id in conn.tebakkimia)) return

    let soal = conn.tebakkimia[id].soal
    let jawaban = soal.unsur.toLowerCase().trim()
    let teks = m.text.toLowerCase().trim()

    if (!conn.tebakkimia[id].msg?.key?.id) return

    let quotedID = conn.tebakkimia[id].msg.key.id
    let isReplyToSoal = m.quoted?.id === quotedID || m.quoted?.key?.id === quotedID

    if (!isReplyToSoal) return

    if (teks === jawaban) {
        global.db.data.users[m.sender].exp += conn.tebakkimia[id].exp
        m.reply(`*Benar!*\n+${conn.tebakkimia[id].exp} XP`)
        clearTimeout(conn.tebakkimia[id].timeout)
        delete conn.tebakkimia[id]
    } else if (similarity(teks, jawaban) >= threshold) {
        m.reply('*Dikit lagi!*')
    } else {
        m.reply('*Salah!*')
    }
}

handler.command = /^tebakkimia|teki$/i
handler.help = ['tebakkimia']
handler.tags = ['game']
handler.group = true
handler.limit = true

module.exports = handler
