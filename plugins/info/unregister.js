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
    if (!args[0]) throw `✳️ *Masukkan nomor seri*\ncontoh! ${usedPrefix + command} sn\n\nNomor serial dapat di lihat di\n\n*${usedPrefix}ceksn*`
    let user = global.db.data.users[m.sender]
    let sn = createHash('md5').update(m.sender).digest('hex')
    if (args[0] !== sn) throw '⚠️ *Nomor SN*'
    user.registered = false
    m.reply(`✅ Success`)
}
handler.help = ['unreg <SN>']
handler.tags = ['main']

handler.command = ['unreg']
handler.register = true

module.exports = handler