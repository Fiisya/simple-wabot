//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : info/sn


const {
    createHash
} = require('crypto')


let handler = async function(m, {
    text,
    usedPrefix
}) {

    let sn = createHash('md5').update(m.sender).digest('hex')
    m.reply(`
Serial Number kamu: 
${sn}`.trim())
}

handler.help = ['nomorseri']
handler.tags = [''rpg']
handler.command = ['nomorseri']
handler.group = true
handler.rpg = true


module.exports = handler