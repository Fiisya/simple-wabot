//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/totalpesan




const handler = async (m, {
    conn,
    participants
}) => {
    if (!global.db.data.totalPesan) global.db.data.totalPesan = {};
    if (!global.db.data.totalPesan[m.sender]) global.db.data.totalPesan[m.sender] = 0;
    global.db.data.totalPesan[m.sender] += 1;

    let messageCounts = participants.map(p => ({
        jid: p.id,
        count: global.db.data.totalPesan[p.id] || 0
    }));

    messageCounts.sort((a, b) => b.count - a.count); // Urutkan dari terbesar ke terkecil
    let totalPesanSemua = messageCounts.reduce((acc, cur) => acc + cur.count, 0);
    let totalPesanKamu = global.db.data.totalPesan[m.sender];

    let caption = "*📊 Statistik Pesan Grup:*\n\n";
    let mentions = [];

    for (let i = 0; i < messageCounts.length; i++) {
        let user = messageCounts[i];
        let mentionUser = `@${user.jid.split("@")[0]}`;
        caption += `*${i + 1}. ${mentionUser}* (${user.count} pesan)\n`;
        mentions.push(user.jid);
    }

    caption += `\n📊 *Total Pesan di Grup:* ${totalPesanSemua}`;
    caption += `\n✉️ *Pesan Kamu:* ${totalPesanKamu}`;

    conn.sendMessage(m.chat, {
        text: caption,
        mentions
    });

    global.db.data.users[m.sender].exp += Math.floor(Math.random() * 20);
};

handler.command = ["totalpesan"];
handler.tags = ["group"];
handler.help = ["totalpesan"];
handler.group = true;
handler.admin = false;

module.exports = handler;