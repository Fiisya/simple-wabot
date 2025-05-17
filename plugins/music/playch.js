//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : music/playch


const axios = require("axios");

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply(`Contoh:\n.playch https://youtube.com/watch?v=xxx\n.playch mellow vibes`);

    try {
        let url, title, author, audioUrl, thumbnail, videoUrl;

        if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
            const {
                data
            } = await axios.get(`https://cloudkutube.eu/api/yta?url=${encodeURIComponent(text)}`);
            if (data.status !== "success") return m.reply("Gagal ambil audio.");
            ({
                title,
                author,
                url: audioUrl,
                thumbnail
            } = data.result);
            videoUrl = text;
        } else {
            const search = await axios.get(`https://flowfalcon.dpdns.org/search/youtube?q=${encodeURIComponent(text)}`);
            const list = search.data.result;
            if (!list || !list.length) return m.reply("Video tidak ditemukan.");
            const video = list[0];
            const {
                data
            } = await axios.get(`https://cloudkutube.eu/api/yta?url=${encodeURIComponent(video.link)}`);
            if (data.status !== "success") return m.reply("Gagal ambil audio.");
            ({
                title,
                author,
                url: audioUrl,
                thumbnail
            } = data.result);
            videoUrl = video.link;
        }

        const idsal = "120363380343761245@newsletter";
        const ctx = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: idsal,
                serverMessageId: Math.floor(Math.random() * 999999),
                newsletterName: "Powered By AlfiXD"
            },
            externalAdReply: {
                title: title,
                body: `By ${author}`,
                thumbnailUrl: thumbnail,
                mediaType: 1,
                sourceUrl: videoUrl
            }
        };

        const audioRes = await axios.get(audioUrl, {
            responseType: "arraybuffer"
        });
        const audioBuffer = Buffer.from(audioRes.data, "binary");

        await conn.sendMessage(idsal, {
            audio: audioBuffer,
            mimetype: "audio/mp4",
            ptt: true,
            contextInfo: ctx
        });

        m.reply(`✔ Sukses kirim *${title}* ke channel.`);
    } catch (err) {
        console.error(err);
        m.reply("Gagal kirim audio ke channel.");
    }
};

handler.help = ['playch'];
handler.tags = ['music', 'saluran'];
handler.command = /^(playch)$/i;
handler.limit = true;
handler.owner = true;

module.exports = handler;