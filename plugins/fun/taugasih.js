//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : fun/taugasih




const fetch = require('node-fetch');
let handler = async (m, {
    conn,
    text
}) => {
    let res = await fetch('https://api.alfixd.my.id/api/tahukahkamu')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.result) throw json
    conn.reply(m.chat, json.result, m)
}
handler.help = ['tahugasih']
handler.tags = ['internet']
handler.command = /^(taugasih|tahugasih)$/i
handler.limit = true
module.exports = handler