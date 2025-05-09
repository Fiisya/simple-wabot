//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/sewabot


const axios = require('axios');
const crypto = require('crypto');

let handler = async (m, {
    conn,
    text,
    command
}) => {
    if (!text) return m.reply(`*Contoh* :\n${command} 1 minggu https://chat.whatsapp.com/xxxx`);

    let [durasi, ...linkArr] = text.trim().split(" ");
    durasi = durasi.toLowerCase() + (linkArr[0] && isNaN(linkArr[0]) ? "" : " " + linkArr.shift());
    let linkGc = linkArr.join(" ").trim();

    if (!linkGc.includes("chat.whatsapp.com")) return m.reply(`*Contoh* :\n${command} 1 minggu https://chat.whatsapp.com/xxxx`);

    let hargaSewa = {
        "7hari": 5000,
        "1minggu": 10000,
        "2minggu": 15000,
        "1bulan": 20000,
        "permanen": 30000,
        "spesial": 50000
    };

    let harga = hargaSewa[durasi.toLowerCase()];
    if (!harga) return m.reply("*Pilihan sewa tidak valid!*\n\n*Pilihan yang tersedia:* \n- 7hari\n- 1minggu\n- 2minggu\n- 1bulan\n- permanen\n- spesial");

    const transactionId = crypto.randomBytes(4).toString("hex");
    const totalPembayaran = harga + Math.floor(Math.random() * 81);

    try {
        let {
            data
        } = await axios.get(`https://restapi.dycoders.xyz/api/qris?amount=${totalPembayaran}&codeqr=00020101021126570011ID.DANA.WWW011893600915365552667402096555266740303UMI51440014ID.CO.QRIS.WWW0215ID10243260493670303UMI5204481453033605802ID5909Alfi Cell6015Kab. Aceh Besar61052337163046261`);

        if (!data.status || !data.image) throw 'Gagal mendapatkan QR dari API.';

        const teks = `
乂 INFORMASI PEMBAYARAN

• ID : ${transactionId}
• Total Pembayaran : Rp${await toIDR(totalPembayaran)}
• Barang : Sewa Bot (${durasi})
• Expired : 5 menit

Note:
QRIS pembayaran hanya berlaku dalam 5 menit. Silakan segera lakukan pembayaran.
`;

        await conn.sendMessage(m.chat, {
            image: {
                url: data.image
            },
            caption: teks,
            viewOnce: false,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });

    } catch (e) {
        console.error(e);
        m.reply("Gagal membuat QR pembayaran. Coba lagi nanti.");
    }
};

handler.help = ['sewabot'];
handler.tags = ['info'];
handler.command = ['sewabot'];
handler.register = true;

module.exports = handler;

async function toIDR(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1.$2");
    return x;
}