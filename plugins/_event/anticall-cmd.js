//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : _event/anticall-cmd


let callWarning = {}

let handler = async (m, {
    conn
}) => {} // dummy agar format cocok

handler.all = async function() {
    if (handler._loaded) return // agar tidak daftar event dua kali
    handler._loaded = true

    this.ws.on('CB:call', async (json) => {
        let call = json.content?.[0]
        if (!call || call.tag !== 'offer') return

        let callerId = json.attrs.from
        let chatData = global.db.data.chats?.[callerId] || {}

        if (!chatData.anticall) return

        if (!callWarning[callerId]) {
            callWarning[callerId] = 1
            await this.sendMessage(callerId, {
                text: '*[PERINGATAN CALL]*\n\nJangan menelpon bot! Jika Anda menelpon lagi, Anda akan diblokir otomatis.',
            })
        } else {
            await this.sendMessage(callerId, {
                text: '*[ANTI-CALL]*\n\nAnda sudah diperingatkan. Karena masih menelpon, Anda sekarang diblokir.',
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
            await this.updateBlockStatus(callerId, 'block')
            delete callWarning[callerId]
        }
    })
}

module.exports = handler