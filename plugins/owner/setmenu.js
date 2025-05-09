//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : owner/setmenu


let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let type = args[0]?.toLowerCase()

    // Show help if no arguments or if help is requested
    if (!type || type === 'help') {
        let caption = `*Menu Display Options*\n\n`
        caption += `Set the menu display type by using the command:\n`
        caption += `${usedPrefix + command} [type]\n\n`
        caption += `Available types:\n`
        caption += `1 - Interactive message with sections (default)\n`
        caption += `2 - Simple text reply\n`
        caption += `3 - Styled text with external ad reply\n`
        caption += `4 - Scheduled call message\n`
        caption += `5 - Payment request message\n`
        caption += `6 - Video/GIF message\n\n`
        caption += `Example: ${usedPrefix + command} 3`

        return conn.reply(m.chat, caption, m)
    }

    // Convert input to number
    const menuTypeId = parseInt(type)

    // Validate input
    if (isNaN(menuTypeId) || menuTypeId < 1 || menuTypeId > 6) {
        return conn.reply(m.chat, `Invalid menu type. Please use a number between 1-6.\nUse ${usedPrefix + command} help for more information.`, m)
    }

    // Check if user has permission (owner only)
    let isOwner = global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    if (!isOwner) {
        return conn.reply(m.chat, 'Only bot owner can change menu display settings', m)
    }

    // Set the menu type
    conn.menubot = conn.menubot || {}
    conn.menubot.id = menuTypeId

    // Get menu type description
    let menuTypes = [
        'Interactive message with sections',
        'Simple text reply',
        'Styled text with external ad reply',
        'Scheduled call message',
        'Payment request message',
        'Video/GIF message'
    ]

    // Send confirmation
    await conn.sendMessage(m.chat, {
        react: {
            text: '✅',
            key: m.key
        }
    })

    let successMsg = `Menu display type successfully set to: ${menuTypeId}\n`
    successMsg += `Description: ${menuTypes[menuTypeId - 1]}\n\n`
    successMsg += `Try the menu by typing: ${usedPrefix}menu`

    return conn.reply(m.chat, successMsg, m)
}

handler.help = ['setmenu <type>']
handler.tags = ['owner']
handler.command = /^(setmenu|menutype|menustyle)$/i

handler.owner = true

module.exports = handler