//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : info/main-unregister


const {
    createHash
} = require('crypto');
let handler = async function(m, {
    conn,
    args,
    command,
    usedPrefix
}) {
    if (!args[0]) throw `✳️ *Masukkan nomor seri*\ncontoh! ${usedPrefix + command} nomorseri\n\nNomor seri dapat di lihat di\n\n*${usedPrefix}nomorseri*`
    let user = global.db.data.users[m.sender]
    let sn = createHash('md5').update(m.sender).digest('hex')
    if (args[0] !== sn) throw '⚠️ *Nomor seri salah*'
    user.registered = false
    m.reply(`✅ Success`)
}
handler.help = ['unreg <Nomor Seri>']
handler.tags = ['main']

handler.command = ['unreg']
handler.register = true

module.exports = handler