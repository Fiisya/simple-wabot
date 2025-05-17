//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/freelimit


let handler = async (m, {
    conn
}) => {
    try {
        // Konfigurasi reward
        const freeLimit = 10;
        const premLimit = 20;
        const timeout = 86400000; // 24 jam dalam milidetik

        let user = global.db.data.users[m.sender];

        let lastClaim = user.lastclaim || 0;
        let remainingTime = timeout - (Date.now() - lastClaim);

        if (remainingTime > 0) {
            let timeLeft = msToTime(remainingTime);
            return await m.reply(`❌ Anda sudah mengklaim hadiah harian hari ini.\nSilakan klaim lagi dalam ${timeLeft}.`);
        }
        let rewardLimit = m.isPremium ? premLimit : freeLimit;
        user.limit = (user.limit || 0) + rewardLimit;
        user.lastclaim = Date.now();

        return await m.reply(`🎉 Selamat! Anda mendapatkan:\n\n+${rewardLimit} Limit\n\nGunakan limit dengan bijak dan klaim lagi besok!`);
    } catch (err) {
        console.error(err);
        return await m.reply("❌ Terjadi kesalahan saat memproses klaim harian.");
    }
};

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours} jam ${minutes} menit ${seconds} detik`;
}

handler.help = ['freelimit'];
handler.tags = ['main'];
handler.command = ["freelimit"];
handler.register = true;

module.exports = handler;