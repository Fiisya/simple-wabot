//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/promote


let handler = async (m, {
    teks,
    conn,
    isOwner,
    isAdmin,
    args,
    command
}) => {
    if (m.isBaileys) return;
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let ownerGroup = m.chat.split`-` [0] + "@s.whatsapp.net";

    if (m.quoted) {
        if (m.quoted.sender === ownerGroup || m.quoted.sender === conn.user.jid) return;
        let usr = m.quoted.sender;
        let nenen = await conn.groupParticipantsUpdate(m.chat, [usr], "promote");
        if (nenen) m.reply(`Sukses menaikan jabatan @${usr.split('@')[0]}!`, null, {
            mentions: [usr]
        });
        return;
    }

    if (!m.mentionedJid[0]) throw `Tag siapa yang ingin dinaikkan jabatannya?`;

    let users = m.mentionedJid.filter(
        (u) => !(u == ownerGroup || u.includes(conn.user.jid))
    );

    for (let user of users) {
        if (user.endsWith("@s.whatsapp.net")) {
            await conn.groupParticipantsUpdate(m.chat, [user], "promote");
            m.reply(`Sukses ${command} @${user.split('@')[0]}!`, null, {
                mentions: [user]
            });
        }
    }
};

handler.help = ['promote @user'];
handler.tags = ['group'];
handler.command = /^(promo?te|admin|\^)$/i;

handler.group = true;
handler.botAdmin = true;
handler.admin = true;
handler.fail = null;

module.exports = handler;

//fix bagian ketika comamnd berjalan mreplay tidak mau terkirim
//m.reply('Sukses promote @${usr.split('@')[0]}!', null, {