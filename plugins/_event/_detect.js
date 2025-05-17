//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : _event/_detect


const moment = require("moment-timezone");
const {
    WAMessageStubType
} = require("baileys");

function isJoinViaLink(author, participant) {
    // Cek apakah author adalah sistem, sama dengan peserta, atau ID grup WA
    return (
        author === participant ||
        author.startsWith("120") ||
        author.includes("g.us")
    );
}

async function before(m, {
    conn
}) {
    if (!m.messageStubType || !m.isGroup) return;

    const metadata = await conn.groupMetadata(m.chat);
    const participants = m.messageStubParameters || [];
    const author = m.sender;
    const chat = global.db.data.chats[m.chat];

    const waktu = moment.tz('Asia/Jakarta').format('HH:mm:ss');
    const tanggal = moment.tz('Asia/Jakarta').format('DD/MM/YYYY');

    const messages = {
        21: `Change Subject Group To:\n *${participants[0]}*`,
        22: `Change the Group Icon`,
        23: `Change group invite link`,
        24: `Change Description Group To:\n\n${participants[0]}`,
        25: `Set to *${participants[0] === "on" ? "Admin Only" : "All Participant"}* Can Change Group Description.`,
        26: `Set to *${participants[0] === "on" ? "Closed" : "Opened"}* Group!\nNow ${participants[0] === "on" ? "Admin Only" : "All Participant"} can send message.`,
        27: isJoinViaLink(author, participants[0]) ?
            `@${participants[0].split('@')[0]} Join Via *Link Group*` :
            `@${author.split('@')[0]} Telah *Menambahkan* @${participants[0].split('@')[0]} ke grup`,
        28: author === participants[0] ?
            `@${participants[0].split('@')[0]} Telah *Keluar* Dari Grup` :
            `@${author.split('@')[0]} Telah *Mengeluarkan* @${participants[0].split('@')[0]} Dari Grup`,
        29: author === participants[0] ?
            `@${participants[0].split('@')[0]} Telah *Menjadi Admin* Grup ${metadata.subject}` :
            `@${author.split('@')[0]} Telah *Menjadikan* @${participants[0].split('@')[0]} sebagai *Admin* Grup ${metadata.subject}`,
        30: author === participants[0] ?
            `@${participants[0].split('@')[0]} Telah *Berhenti* Menjadi *Admin* Grup ${metadata.subject}` :
            `@${author.split('@')[0]} Telah *Menghentikan* @${participants[0].split('@')[0]} Sebagai *Admin* Grup ${metadata.subject}`,
        70: `Invite Sent To Group`,
        71: `Request to Join the Group`,
        72: `Change Ephemeral To *@${participants[0]}*`,
        74: `Sent ViewOnce Message`,
    };

    const messageType = messages[m.messageStubType];
    if (messageType) {
        await conn.sendMessage(
            m.chat, {
                text: `*${messageType}`,
                mentions: participants.map(p => p.includes("@") ? p : `${p}@s.whatsapp.net`).concat([author]),
            },
        );
    }
}

module.exports = {
    before,
};