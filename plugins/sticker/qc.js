//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : maker/qc


const {
    Sticker
} = require("akiraa-scrape");
const axios = require("axios");
let moment = require("moment-timezone");

const handler = async (m, {
    conn,
    args
}) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";
    let reply;
    if (!m.quoted) {
        reply = {};
    } else if (!q.sender === q.sender) {
        reply = {
            name: q.name,
            text: q.text || "",
            chatId: q.chat.split("@")[0],
        };
    }
    let text;
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted) {
        text = m.quoted.text || "";
    } else {
        throw "*• Example :* .qc *[text or reply message]*";
    }

    const img = await q.download?.();

    const pp = await conn
        .profilePictureUrl(q.sender, "image")
        .catch((_) => "https://telegra.ph/file/320b066dc81928b782c7b.png");
    let randomColor = ['#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500'];

    let apiColor = randomColor[Math.floor(Math.random() * randomColor.length)];
    if (mime) {
        const obj = {
            type: "quote",
            format: "png",
            backgroundColor: apiColor,
            width: 512,
            height: 768,
            scale: 2,
            messages: [{
                entities: [],
                media: {
                    url: await Uploader.Uguu(img),
                },
                avatar: true,
                from: {
                    id: m.chat.split("@")[0],
                    name: q.name,
                    photo: {
                        url: pp,
                    },
                },
                text: text || "",
                replyMessage: reply,
            }, ],
        };

        const json = await axios.post(
            "https://qc.botcahx.eu.org/generate",
            obj, {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const buffer = Buffer.from(json.data.result.image, "base64");
        conn.sendImageAsSticker(m.chat, buffer, m, {
            packname: `Time : ${moment.tz("Asia/Makassar")}\n`,

            author: `Created By ${m.name}\nBy © Asyl`,
        });
    } else {
        let randomColor = ['#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500'];

        let apiColor = randomColor[Math.floor(Math.random() * randomColor.length)];
        const obj = {
            type: "quote",
            format: "png",
            backgroundColor: apiColor,
            width: 512,
            height: 768,
            scale: 2,
            messages: [{
                entities: [],
                avatar: true,
                from: {
                    id: m.chat.split("@")[0],
                    name: q.name,
                    photo: {
                        url: pp,
                    },
                },
                text: text || "",
                replyMessage: reply,
            }, ],
        };

        const json = await axios.post(
            "https://qc.botcahx.eu.org/generate",
            obj, {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const buffer = Buffer.from(json.data.result.image, "base64");
        conn.sendImageAsSticker(m.chat, buffer, m, {
            packname: `Time : ${moment.tz("Asia/Makassar")}\n`,

            author: `Created By ${m.name}\nBy © Asyl`,
        });
    }
};

handler.help = ["qc"].map((a) => a + " *[text or reply message]*");
handler.tags = ["sticker"];
handler.command = ["qc"];

module.exports = handler;