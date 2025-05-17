//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : _event/antilinkgc


const groupLinkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
const waMeRegex = /wa\.me\/(\d+)/i;

const before = async function(m, {
    isAdmin,
    isBotAdmin
}) {
    if (m.isBaileys && m.fromMe) return;

    const chat = global.db.data.chats[m.chat] || {};
    const isGroup = m.isGroup;
    const text = m.text || '';

    const foundGroupLink = groupLinkRegex.exec(text);
    const foundWaMe = waMeRegex.exec(text);

    const linkThisGroup = isGroup && isBotAdmin ?
        `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}` :
        null;

    // Deteksi link grup
    if (chat.antiLink && isGroup && foundGroupLink && !isAdmin) {
        if (linkThisGroup && text.includes(linkThisGroup)) return;

        if (chat.teks) {
            await m.reply(
                `_*‼️ Link Group Terdeteksi!*_\n${chat.pembatasan ? '_Pesan kamu akan dihapus! ❌_' : '_Pesan kamu akan dihapus dan kamu akan dikick! ❌_'}${!isBotAdmin ? '\n\n_❬Bot Bukan Admin❭_' : ''}`
            );
        }

        if (isBotAdmin) {
            await this.sendMessage(m.chat, {
                delete: m.key
            });
            if (!chat.pembatasan) {
                await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            }
        }
    }

    // Deteksi link wa.me
    else if (chat.antiLinkWa && isGroup && foundWaMe && !isAdmin) {
        if (chat.teks) {
            await m.reply(
                `_*‼️ Link WhatsApp Terdeteksi!*_\n${chat.pembatasan ? '_Pesan kamu akan dihapus! ❌_' : '_Pesan kamu akan dihapus dan kamu akan dikick! ❌_'}${!isBotAdmin ? '\n\n_❬Bot Bukan Admin❭_' : ''}`
            );
        }

        if (isBotAdmin) {
            await this.sendMessage(m.chat, {
                delete: m.key
            });
            if (!chat.pembatasan) {
                await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            }
        }
    }
};

module.exports = {
    before
};