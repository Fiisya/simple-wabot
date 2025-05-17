//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/velyn


/**
 * name fitur : velyn AI logic
 * note : dilarang haus tempelin watermark
 */

const fetch = require('node-fetch')

let handler = async (m, {
    text,
    conn,
    usedPrefix,
    command
}) => {
    try {
        if (!text) throw `Tulis sesuatu setelah perintah ini.\n\nContoh:\n${usedPrefix}${command} hai lyn apa kabar?\n${usedPrefix}${command} https://vt.tiktok.com/ZSFxYcCdr/\n${usedPrefix}${command} buatkan gambar wanita`

        let regexTikTok = /(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/gi
        let isTikTok = regexTikTok.test(text)
        let isImageReq = /(gambar|buatkan.*gambar|bikin.*gambar|buat.*gambar)/i.test(text)

        if (isTikTok) {
            let link = text.match(regexTikTok)[0]
            let res = await fetch(`https://www.velyn.biz.id/api/downloader/tiktok?url=${encodeURIComponent(link)}`)
            let json = await res.json()

            if (!json?.status || !json?.data?.no_watermark) {
                throw `❌ Error\nLogs error : Gagal mengunduh video TikTok.`
            }

            let prompt = `Buatkan caption menarik untuk video TikTok dengan judul: ${json?.data?.title || 'tanpa judul'}`
            let aiRes = await fetch(`https://www.velyn.biz.id/api/ai/velyn-1.0-1b?prompt=${encodeURIComponent(prompt)}`)
            let aiJson = await aiRes.json()

            if (!aiJson?.status || !aiJson?.result) {
                throw `❌ Error\nLogs error : Gagal mendapatkan caption dari AI.`
            }

            await conn.sendMessage(m.chat, {
                video: {
                    url: json.data.no_watermark
                },
                caption: aiJson.result.toString()
            }, {
                quoted: m
            })

        } else if (isImageReq) {
            let prompt = text
            let res = await fetch(`https://www.velyn.biz.id/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`)
            if (!res.ok) throw `❌ Error\nLogs error : Gagal menghubungi layanan gambar.`

            let buffer = await res.buffer()
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: `Berikut hasil gambar untuk prompt:\n*${prompt}*`
            }, {
                quoted: m
            })

        } else {
            let prompt = text
            let res = await fetch(`https://www.velyn.biz.id/api/ai/velyn-1.0-1b?prompt=${encodeURIComponent(prompt)}`)
            let json = await res.json()

            if (!json?.status || !json?.result) {
                throw `❌ Error\nLogs error : Gagal merespons pesan AI.`
            }

            m.reply(json.result.toString())
        }

    } catch (e) {
        console.error(e)
        m.reply(`❌ Error\nLogs error : ${(e?.message || e).toString()}`)
    }
}

handler.command = ['velyn', 'lyn', 'vel'];
handler.tags = ['ai'];
handler.help = ['velyn *[teks | link tiktok | gambar]*'];

module.exports = handler;