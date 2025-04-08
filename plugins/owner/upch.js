//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : owner/upch




const handler = async (m, {
    conn,
    text
}) => {
    if (!text && !m.quoted) return m.reply("Masukan teks atau reply media dengan teks");

    const chid = "120363380343761245@newsletter"; //isi dengan id channel mu
    let messageOptions = {};

    if (m.quoted && m.quoted.mimetype) {
        let mime = m.quoted.mimetype;

        if (/image/.test(mime)) {
            messageOptions = {
                image: await m.quoted.download(),
                caption: text || m.quoted.text || ""
            };
        } else if (/video/.test(mime)) {
            messageOptions = {
                video: await m.quoted.download(),
                caption: text || m.quoted.text || ""
            };
        } else if (/audio/.test(mime)) {
            messageOptions = {
                audio: await m.quoted.download()
            };
        } else if (/sticker/.test(mime)) {
            messageOptions = {
                sticker: await m.quoted.download()
            };
        }
    } else {
        messageOptions = {
            text: text
        };
    }

    await conn.sendMessage(chid, messageOptions);

    m.reply("Pesan berhasil dikirim");
};

handler.command = handler.help = ['upch'];
handler.tags = ['owner']
handler.owner = true
module.exports = handler;