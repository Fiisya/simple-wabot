//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/claim


let handler = async (m, {
    conn,
    args,
    usedPrefix
}) => {
    const user = global.db.data.users[m.sender];
    const today = new Date().toLocaleDateString();
    const cooldownDuration = 86400000; // 1 day in milliseconds

    // Merge codes from conn.claim[m.sender].code array with validGiftCodes (removing duplicates)
    const validGiftCodes = [
        ...new Set([
            'limit',
            'Limit',
            'LIMIT',
            'Money',
            'ALPIK',
            'LEPI',
            ...(conn.claim && conn.claim[m.sender] && conn.claim[m.sender].code ? conn.claim[m.sender].code : [])
        ])
    ];

    if (conn.claim && conn.claim[m.sender] && conn.claim[m.sender].time === today) {
        const remainingCooldown = user.lastGift + cooldownDuration - new Date();
        const remainingTime = getRemainingTime(remainingCooldown);

        return conn.reply(m.chat, `🎁 Kamu sudah menggunakan Gift Gratis hari ini.hanya bisa digunakan sekali sehari!\n\nClaim Gratis dapat digunakan kembali setelah:\n${remainingTime}\n\n`, m);
    }

    if (!args[0]) {
        return conn.reply(m.chat, `❓ cara penggunaan salah!\n\nContoh: *${usedPrefix}claim limit*`, m);
    }

    if (validGiftCodes.includes(args[0])) {
        conn.reply(m.chat, '*🎉 SELAMAT!*\nKamu telah mendapatkan:\n💠 5000 XP\n🎫 30 Limit\n💹 10000 Money\n🥤 10 Potion', m);
        user.exp += 5000;
        user.limit += 30;
        user.money += 10000;
        user.potion += 10;

        // Set the session to mark that the user has used the gift code today
        if (!conn.claim) conn.claim = {};
        conn.claim[m.sender] = {
            time: today
        };

        // Set timeout for gift code usage (1 day)
        setTimeout(() => {
            delete conn.claim[m.sender];
            conn.reply(m.chat, '⏰ Waktunya menggunakan claim lagi!\nKetik *claim limit* untuk mendapatkan hadiah spesial.', m);
        }, cooldownDuration);
    } else {
        conn.reply(m.chat, `*❌ TIDAK VALID  ❌*\nSilakan periksa kembali claim yang kamu masukkan.\n\nContoh: *${usedPrefix}claim limit*`, m);
    }
};

handler.help = ['claim <optional>'];
handler.tags = ['main'];
handler.command = /^claim$/i;

module.exports = handler;

function getRemainingTime(ms) {
    let days = Math.floor(ms / 86400000);
    let hours = Math.floor((ms % 86400000) / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);

    let remainingTime = '';
    if (days > 0) remainingTime += `${days} hari `;
    if (hours > 0) remainingTime += `${hours} jam `;
    if (minutes > 0) remainingTime += `${minutes} menit `;
    if (seconds > 0) remainingTime += `${seconds} detik`;

    return remainingTime.trim();
}