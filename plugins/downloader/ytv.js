const axios = require('axios');
const yts = require("yt-search");

const handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply(`Input URL YouTube!\n\nExample:\n*${usedPrefix + command} *(input url/query)*`);
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
        const {
            data
        } = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`);

        if (!data.status || !data.data || !data.data.dl) throw 'Gagal mendapatkan video.';

        const {
            title,
            dl
        } = data.data;

        await conn.sendMessage(m.chat, {
            video: {
                url: dl
            },
            caption: `*Title:* ${title}\n*Status:* Sucees Result\n© Simple bot WhatsApp By Asyl`,
            mimetype: 'video/mp4'
        }, {
            quoted: m
        });

    } catch (e) {
        return m.reply(`Error: ${e.message}`);
    }
};

handler.help = ["ytmp4"];
handler.tags = ['downloader'];
handler.command = ["ytmp4", "ytvid", "ytv"];

module.exports = handler;