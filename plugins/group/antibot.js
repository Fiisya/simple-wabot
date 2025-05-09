//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/antibot


// plugins/antibot.js

let handler = async (m, {
    conn,
    text,
    command,
    participants
}) => {
    global.antibotGroups = global.antibotGroups || {}

    if (!m.isGroup) return m.reply('Fitur ini hanya bisa dipakai di grup!')

    const botNumber = conn.user.jid || conn.decodeJid(conn.user.id)
    const botParticipant = participants.find(p => p.id === botNumber)
    const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin'

    if (!isBotAdmin) return m.reply('Bot bukan admin!')
    if (!text) return m.reply(`Contoh:\n.${command} on\n.${command} off`)

    if (text.toLowerCase() === 'on') {
        global.antibotGroups[m.chat] = true
        m.reply('✅ Fitur *Antibot* berhasil diaktifkan di grup ini.')
    } else if (text.toLowerCase() === 'off') {
        global.antibotGroups[m.chat] = false
        m.reply('❌ Fitur *Antibot* dimatikan di grup ini.')
    } else {
        m.reply(`Gunakan format:\n.${command} on\n.${command} off`)
    }
}

// Filter pesan mencurigakan dari bot (anti bot auto kick)
handler.before = async function(m, {
    conn
}) {
    global.botWarnings = global.botWarnings || {}
    global.antibotGroups = global.antibotGroups || {}

    if (!m.isGroup || !global.antibotGroups[m.chat]) return

    const groupId = m.chat
    const sender = m.sender
    const pushName = m.pushName?.toLowerCase() || ''
    const textMsg = (
        m?.message?.conversation ||
        m?.message?.extendedTextMessage?.text ||
        m?.message?.imageMessage?.caption ||
        m?.message?.videoMessage?.caption ||
        m?.message?.documentMessage?.caption ||
        m?.message?.buttonsMessage?.contentText ||
        m?.message?.templateMessage?.hydratedTemplate?.hydratedContentText ||
        m?.message?.listMessage?.description ||
        m?.message?.viewOnceMessage?.message?.conversation ||
        ''
    ).toLowerCase()

    const ctx =
        m.message?.extendedTextMessage?.contextInfo ||
        m.message?.imageMessage?.contextInfo ||
        m.message?.videoMessage?.contextInfo ||
        m.message?.documentMessage?.contextInfo ||
        m.message?.buttonsMessage?.contextInfo ||
        m.message?.templateMessage?.contextInfo || {}

    const isPossibleBot =
        pushName.match(/botz|bot|wa bot|whatsapp bot/) ||
        textMsg.match(/hallo pengguna|silakan tekan tombol|permintaan anda sedang diproses/i) ||
        textMsg.match(/hello user|please wait|click the button|your request is being processed/i) ||
        ctx.externalAdReply != null ||
        ctx.forwardedNewsletterMessageInfo != null

    if (isPossibleBot) {
        global.botWarnings[groupId] = global.botWarnings[groupId] || {}
        global.botWarnings[groupId][sender] = (global.botWarnings[groupId][sender] || 0) + 1
        const warn = global.botWarnings[groupId][sender]

        if (warn <= 2) {
            await conn.sendMessage(groupId, {
                text: `⚠️ *Antibot aktif!*\nBot tidak diizinkan di grup ini!\nPeringatan ke-${warn}/3`,
                mentions: [sender]
            })
            await conn.sendMessage(groupId, {
                delete: m.key
            }).catch(() => {})
        } else {
            await conn.sendMessage(groupId, {
                text: `Bot @${sender.split('@')[0]} telah dikeluarkan dari grup karena melanggar aturan.`,
                mentions: [sender]
            })
            await conn.groupParticipantsUpdate(groupId, [sender], 'remove').catch(() =>
                conn.sendMessage(groupId, {
                    text: '⚠️ Gagal kick bot. Mungkin bot bukan admin.'
                })
            )
            delete global.botWarnings[groupId][sender]
        }
    }
}

handler.help = ['antibot [on/off]']
handler.tags = ['group']
handler.command = ['antibot']
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler