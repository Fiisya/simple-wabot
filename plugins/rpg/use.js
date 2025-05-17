//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : rpg/use


let handler = async (m, {
    conn,
    args,
    usedPrefix
}) => {
    let user = global.db.data.users[m.sender]
    let maxHealth = 100
    let healing = 40 // jumlah heal per 1 potion

    if (!args[0] || isNaN(args[0])) {
        return conn.reply(m.chat, `Penggunaan:\n*${usedPrefix}use potion <jumlah>*`, m)
    }

    let count = Math.max(1, parseInt(args[0]))

    if (user.potion < count) {
        return conn.reply(m.chat, `Potionmu tidak cukup. Kamu hanya punya *${user.potion}* potion.`, m)
    }

    if (user.health >= maxHealth) {
        return conn.reply(m.chat, `Nyawamu sudah penuh!`, m)
    }

    let heal = healing * count
    if (user.health + heal > maxHealth) {
        heal = maxHealth - user.health
        count = Math.ceil(heal / healing)
    }

    user.health += heal
    user.potion -= count

    conn.reply(m.chat, `Kamu menggunakan *${count}* potion dan memulihkan *${heal}* nyawa.\nNyawamu sekarang: *${user.health}/${maxHealth}*`, m)
}

handler.help = ['use potion <jumlah>']
handler.tags = ['rpg']
handler.command = /^use$/i

module.exports = handler