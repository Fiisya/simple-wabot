//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/infogempa


/**
• Plugins Info Gempa
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
• Sumber Scrape: https://whatsapp.com/channel/0029Vay9UUE7T8bUHDMZCo1I/1578
*/

// import axios from "axios"
// import cheerio from "cheerio"
const axios = require("axios");
const cheerio = require("cheerio");

async function getGempa() {
    try {
        const url = "https://www.bmkg.go.id/gempabumi/gempabumi-realtime";
        const {
            data
        } = await axios.get(url);
        const $ = cheerio.load(data);

        const hasil = [];

        $("tbody tr").each((i, el) => {
            const waktu = $(el).find("td").eq(1).text().trim().replace(/\s+/g, " ");
            const magnitudo = $(el).find("td").eq(2).text().trim();
            const kedalaman = $(el).find("td").eq(3).text().trim();
            const koordinat = $(el).find("td").eq(4).text().trim();
            const wilayah = $(el).find("td").eq(5).text().trim();

            hasil.push({
                waktu,
                magnitudo,
                kedalaman,
                koordinat,
                wilayah,
            });
        });

        return hasil;
    } catch (err) {
        console.error("Gagal ambil data:", err.message);
        throw err;
    }
}

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    try {
        await m.reply('🔄 Mengambil data gempa terbaru dari BMKG...');

        const gempaData = await getGempa();
        if (!gempaData || gempaData.length === 0) {
            return m.reply('❌ Gagal mendapatkan data gempa atau tidak ada data tersedia.');
        }

        const latest = gempaData[0];

        const message = `🌍 *INFO GEMPA TERKINI* 🌍
    
📅 *Waktu:* ${latest.waktu}
⚡ *Magnitudo:* ${latest.magnitudo}
🔻 *Kedalaman:* ${latest.kedalaman}
📍 *Koordinat:* ${latest.koordinat}
🏙️ *Wilayah:* ${latest.wilayah}

_Data diperbarui secara realtime dari BMKG_`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "INFO GEMPA BMKG",
                    body: "Data gempa bumi terbaru",
                    thumbnailUrl: "https://aktual.com/wp-content/uploads/2021/04/186-bmkg-800x450-1.jpeg",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        });

    } catch (error) {
        console.error(error);
        m.reply('❌ Gagal mengambil data gempa. Silakan coba lagi nanti.');
    }
};

handler.help = ['infogempa'];
handler.tags = ['internet'];
handler.command = /^(infogempa|gempa|earthquake)$/i;

module.exports = handler;
// export default handler