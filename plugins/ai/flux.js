//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/flux


let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply(`Gunakan format: ${usedPrefix + command} <prompt>`);

    let apiUrl = `https://restapi.rizk.my.id/textimg?prompt=${encodeURIComponent(text)}&model=flux&size=1024x1024&apikey=free`;

    try {
        let {
            data
        } = await require("axios").get(apiUrl);

        if (data.status && data.images.length > 0) {
            for (let img of data.images) {
                await conn.sendFile(m.chat, img, "image.jpg", `Hasil dari: ${text}`, m);
            }
        } else {
            m.reply("Gagal mendapatkan gambar.");
        }
    } catch (e) {
        console.error(e);
        m.reply("Terjadi kesalahan saat mengambil gambar.");
    }
};

handler.help = ["flux"];
handler.tags = ["ai"];
handler.command = ["flux"];

module.exports = handler;