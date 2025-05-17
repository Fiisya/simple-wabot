/*
 * code _event/antitagsw.js
 * credits: Nazir
 * simple WhatsApp bot
 */
/* async fution before(m, {
    isBotAdmin,
    isAdmin
}) {
    ;
    if (!m.chat === "120363305260394129@g.us") return //ganti sama id gc kalian
    const isTaggingInStatus = (
        m.mtype === 'groupStatusMentionMessage' ||
        (m.quoted && m.quoted.mtype === 'groupStatusMentionMessage') ||
        (m.message && m.message.groupStatusMentionMessage) ||
        (m.message && m.message.protocolMessage && m.message.protocolMessage.type === 25)
    )

    if (!isTaggingInStatus) return
    await conn.sendMessage(m.chat, {
        delete: m.key
    })

    if (isAdmin) { // nambahin jika admin maka ha di kick cuma hapus pesan aja
        let warningMessage = `Grup ini terdeteksi ditandai dalam Status WhatsApp\n\n` +
            `@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp` +
            `\n\nHal tersebut tidak diperbolehkan dalam grup ini.`

        return conn.sendMessage(m.chat, {
            text: warningMessage,
            mentions: [m.sender]
        })
    }

    if (isBotAdmin) {
        await conn.sendMessage(m.chat, {
            text: `Ups Di Group Sini Tidak Boleh Tag Status Ke Group Karena Banyak Sw Yg Malas Gw Liat.
  jika Melakukan ini lagi saya bakalan keluarkan kamu dari group
  
  Sender Warning: [⚠️] = @${m.sender.split("@")[0]}`,
            mentions: [m.sender]
        })
    } else {
        let warningMessage = `Grup ini terdeteksi ditandai dalam Status WhatsApp\n\n` +
            `@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp` +
            `\n\nHal tersebut tidak diperbolehkan dalam grup ini.`

        return conn.sendMessage(m.chat, {
            text: warningMessage,
            mentions: [m.sender]
        })
    }
}
module.exports = {
    before
} */