//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/intro


let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let pp = await conn.profilePictureUrl(m.chat).catch(_ => null)

    let krtu = `[ 𝐊𝐚𝐫𝐭𝐮 𝐈𝐧𝐭𝐫𝐨 ]
𝐍𝐚𝐦𝐚 :
𝐔𝐦𝐮𝐫  :
𝐀𝐬𝐚𝐥  :
𝐆𝐞𝐧𝐝𝐞𝐫 :
`
    m.reply(krtu)
}
handler.help = ['intro']
handler.tags = ['group']
handler.command = /^(introd)$/i

module.exports = handler