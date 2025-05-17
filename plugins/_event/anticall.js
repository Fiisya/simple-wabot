//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : _event/anticall


let handler = async function(m, {
    args
}) {
    global.db.data.chats ||= {}
    const chat = global.db.data.chats[m.chat] ||= {}
    const arg = (args[0] || '').toLowerCase()

    if (arg === 'on') {
        chat.anticall = true
        m.reply('✅ Fitur *Anti-Call* telah diaktifkan di chat ini.')
    } else if (arg === 'off') {
        chat.anticall = false
        m.reply('❌ Fitur *Anti-Call* telah dinonaktifkan di chat ini.')
    } else {
        m.reply('Format salah!\nGunakan: *.anticall on* atau *.anticall off*')
    }
}
handler.command = ['anticall']
handler.tags = ['tools']
handler.help = ['anticall [on/off]']
handler.register = true

module.exports = handler