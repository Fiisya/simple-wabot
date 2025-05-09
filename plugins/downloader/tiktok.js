//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : Tiktok
// Sumber: https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `*• Example :* ${usedPrefix + command} *[Tiktok Url]*`;
    try {
        let fetch = await Scraper["Download"].tiktok.v1(text);
        let {
            data
        } = fetch;
        let lastMessage;
        if (data.images) {
            let cap = `*ID :* ${data.id}\n*Views :* ${Func.formatNumber(data.play_count)}\n*Likes :* ${Func.formatNumber(data.digg_count)}\n*Comment :* ${Func.formatNumber(data.comment_count)}\n*Author :* ${data.author.nickname}\n\n*Title :* ${data.title}`
            let array = []
            for (let i = 0; i < data.images.length; i++) {
                const image = data.images[i];
                array.push([`*乂 T I K T O K - D O W N L O A D E R*
       
  ◦  *Total photos* : ${data.images.length}
  ◦  *Result Ke* : ${array.length}
  
  © Simple Whatsapp Bot by Asyl`, wm, image, []])
            }
            conn.sendCarousel(m.chat, array, m, {
                body: cap,
                footer: "© Asyl"
            })
        } else {
            lastMessage = await conn.sendMessage(
                m.chat, {
                    video: {
                        url: data.play,
                    },
                    caption: `┌─⭓「 *Tiktok Downloader* 」\n│ *• ID :* *[ ${data.id} ]*\n│ *• Views :* ${Func.formatNumber(data.play_count)}\n│ *• Likes :* ${Func.formatNumber(data.digg_count)}\n│ *• Comment :* ${Func.formatNumber(data.comment_count)}\n│ *• Author :* ${data.author.nickname}\n└───────────────⭓\n*• Title :* ${data.title}`,
                }, {
                    quoted: m,
                },
            );

            await conn.sendMessage(
                m.chat, {
                    audio: {
                        url: data.music,
                    },
                    mimetype: "audio/mpeg",
                    contextInfo: {
                        externalAdReply: {
                            title: data.music_info.title,
                            body: '',
                            thumbnailUrl: data.author.avatar,
                            sourceUrl: `https://www.tiktok.com/@` + data.music_info.author,
                            mediaType: 1,
                            renderLargerThumbnail: false,
                        },
                    },
                }, {
                    quoted: lastMessage,
                },
            );
        }
    } catch (e) {
        try {
            let tiktok = await Scraper["Download"].tiktok.v2(text);
            let cap = `┌─⭓「 *TiktokV2 Downloader* 」\n│ *• Caption :* ${tiktok.caption}\n└───────────────⭓`;
            let key = await conn.sendFile(m.chat, tiktok.server1.url, null, cap, m);
        } catch (e) {
            throw eror;
        }
    }
};

handler.help = ["tiktok"].map((a) => a + " *[Tiktok Url]*");
handler.tags = ["downloader"];
handler.command = ["tt", "tiktok", "ttslide", "ttdl"];

module.exports = handler;