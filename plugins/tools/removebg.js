//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/removebg


const axios = require('axios');

let handler = async (m, {
    conn
}) => {
    let quotedMessage = m.quoted ? m.quoted : m;
    let mimeType = (quotedMessage.msg || quotedMessage).mimetype || '';

    if (/image/.test(mimeType)) {
        await conn.sendMessage(m.chat, {
            react: {
                text: '🕒',
                key: m.key
            }
        });

        let downloadedImage = await quotedMessage.download();

        try {
            let removedBgResult = await removeBackground(downloadedImage);
            let sentMsg = await conn.sendFile(m.chat, removedBgResult.image, 'removed.png', '', m);

            setTimeout(() => {
                conn.sendMessage(m.chat, {
                    delete: sentMsg.key
                });
            }, 30000);

        } catch (err) {
            console.error(err);
            conn.reply(m.chat, 'Terjadi kesalahan saat menghapus latar belakang gambar.', m);
        }
    } else {
        conn.reply(m.chat, 'Balas gambar dengan caption *.removebg*', m);
    }
};

handler.help = ['nobg', 'removebg'];
handler.tags = ['tools'];
handler.command = /^(nobg|removebg)$/i;

module.exports = handler;

async function removeBackground(buffer) {
    try {
        if (!buffer) return {
            status: false,
            message: "Buffer tidak ditemukan"
        };

        return await new Promise((resolve, reject) => {
            const base64Image = buffer.toString("base64");
            axios.post("https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
                image: `data:image/png;base64,${base64Image}`,
                model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003"
            }).then(response => {
                const cleanData = response.data?.replace(`"`, "");
                console.log(response.status, cleanData);
                if (!cleanData) return reject("Gagal menghapus latar belakang gambar.");
                resolve({
                    status: true,
                    image: cleanData
                });
            }).catch(reject);
        });
    } catch (error) {
        return {
            status: false,
            message: error
        };
    }
}