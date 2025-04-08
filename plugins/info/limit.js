//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/limit


let handler = async (m, {
    conn
}) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
    let user = global.db.data.users[who]
    let limit = user.premiumTime >= 1 ? 'Unlimited' : user.limit
    m.reply(`
❏ *Username:* ${user.registered ? user.name : conn.getName(who)}
▧ *Limit:* ${limit} / 1000
`.trim())
}
handler.help = ['limit [@user]']
handler.tags = ['main']
handler.command = /^(limit)$/i
module.exports = handler