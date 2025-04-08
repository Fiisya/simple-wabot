//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : downloader/yta.js
// Sumber: https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP


const yts = require("yt-search");
const axios = require("axios");

const handler = async (m, {
    conn,
    command,
    text,
    usedPrefix
}) => {
    if (!text) throw `*• Example :* ${usedPrefix + command} *[query/url]*`;
    let txt;
    if (Func.isUrl(text)) {
        txt = text
    } else {
        txt = (await yts(text)).videos[0].url
    }
    conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });
        
    try {
        let api = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${txt}`)
        let result = api.data.result.metadata;
        let teks = "*" + result.title + "*" + "\n\n*Durasi:* " + result.timestamp + "\n*Views:* " + result.views + "\n*Upload:* " + result.ago + "\n*Link:* " + result.url;
        let doc = {
            text: teks,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: result.title,
                    body: "Asyl Mode Sad",
                    thumbnailUrl: result.thumbnail,
                    renderLargerThumbnail: true
                },
            },
        }

        let qme = await conn.sendMessage(m.chat, doc, {
            quoted: m,
        });
        let lagu = {
            audio: {
                url: api.data.result.download.url
            },
            filename: "lagu.mp3",
            mimetype: "audio/mpeg",
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaUrl: result.url,
                    title: result.title,
                    body: "Asyl Mode Sad",
                    sourceUrl: result.url,
                    thumbnailUrl: result.thumbnail,
                    renderLargerThumbnail: false
                },
            },
        }

        await conn.sendMessage(m.chat, lagu, {
            quoted: qme,
        });
    } catch {
        try {
            let api = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${txt}`)
            let result = api.data.result.metadata;
            let teks = "*" + result.title + "*" + "\n\n*Durasi:* " + result.timestamp + "\n*Views:* " + result.views + "\n*Upload:* " + result.ago + "\n*Link:* " + result.url;
            let doc = {
                text: teks,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        title: result.title,
                        body: "Asyl Mode Sad",
                        thumbnailUrl: result.thumbnail,
                        renderLargerThumbnail: true
                    },
                },
            }

            let qme = await conn.sendMessage(m.chat, doc, {
                quoted: m,
            });
            let lagu = {
                audio: {
                    url: api.data.result.download.url
                },
                filename: "lagu.mp3",
                mimetype: "audio/mpeg",
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaUrl: result.url,
                        title: result.title,
                        body: "Asyl Mode Sad",
                        sourceUrl: result.url,
                        thumbnailUrl: result.thumbnail,
                        renderLargerThumbnail: false
                    },
                },
            }

            await conn.sendMessage(m.chat, lagu, {
                quoted: qme,
            });
        } catch (e) {
            m.reply(e)
        }
    }
}
handler.help = ["ytmp3",].map((a) => a + ` *[query/url]*`);
handler.tags = ["downloader"];
handler.command = ["ytaudio", "ytmp3", "yta"];

handler.exp = 0;
handler.register = false;
handler.limit = true;

module.exports = handler;