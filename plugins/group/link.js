//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/link


let handler = async (m, {
    conn
}) => {
    try {
        conn.reply(m.chat, `*Link Group:* ${await conn.getName(m.chat)}\n\nhttps://chat.whatsapp.com/` + await conn.groupInviteCode(m.chat) + `\n\n${conn.user.name}`, m)
    } catch {
        conn.reply(m.chat, `Jadikan @${conn.user.jid.split('@')[0]} sebagai admin untuk menggunakan perintah ini!`, m, {
            mentions: [conn.user.jid]
        })
    }
}
handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(g(c)?ro?up)?$/i

handler.group = true
handler.admin = true

module.exports = handler