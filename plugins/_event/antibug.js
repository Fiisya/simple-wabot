//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : _event/antibug


module.exports = {
    name: 'antiBug',
    type: 'all',
    async before(m, {
        conn,
        isBotAdmins
    }) {
        if (!global.tukangBug) global.tukangBug = {}
        if (m.key.fromMe) return

        const sender = m.sender
        const now = Date.now()

        if (!global.tukangBug[sender]) {
            global.tukangBug[sender] = {
                count: 1,
                messages: [m.key],
                waktuJing: now
            }
        } else {
            const elapsed = now - global.tukangBug[sender].waktuJing
            global.tukangBug[sender].waktuJing = now

            if (elapsed <= 3000) {
                global.tukangBug[sender].count++
                global.tukangBug[sender].messages.push(m.key)
            } else {
                global.tukangBug[sender].count = 1
                global.tukangBug[sender].messages = [m.key]
            }
        }

        if (global.tukangBug[sender].count >= 5) {
            try {
                const messages = global.tukangBug[sender].messages

                if (m.isGroup) {
                    if (isBotAdmins) {
                        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
                        for (let msg of messages) {
                            let key = {
                                remoteJid: msg.remoteJid || m.chat,
                                fromMe: false,
                                id: msg.id || msg.key.id,
                                participant: msg.participant || msg.key.participant
                            }
                            await conn.sendMessage(m.chat, {
                                delete: key
                            })
                        }
                    } else {
                        for (let msg of messages) {
                            await conn.sendMessage(m.chat, {
                                delete: {
                                    remoteJid: m.chat,
                                    id: msg.id,
                                    fromMe: true
                                }
                            })
                        }
                    }
                } else {
                    await conn.updateBlockStatus(sender, 'block')
                    for (let msg of messages) {
                        await conn.sendMessage(m.chat, {
                            delete: {
                                remoteJid: m.chat,
                                id: msg.id,
                                fromMe: true
                            }
                        })
                    }
                }

                delete global.tukangBug[sender]
                return !0 // hentikan handler berikutnya
            } catch (err) {
                console.log('amboi')
            }
        }
    }
}