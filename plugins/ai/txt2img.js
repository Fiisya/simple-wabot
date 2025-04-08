//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/txt2img


/*
- Fitur: Deepimg
- Info: Generate Image from api deepimg
- Type: Plugins `ESM`& `CJS`
- By: SkyWalker
- [ `SUMBER` ]
- https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u
*/

const axios = require('axios')

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply("Masukkan prompt gambar.")

    m.reply("Sedang memproses gambar, mohon tunggu...")

    let imageUrl = await generateImage(text)
    if (!imageUrl) return m.reply("gagal membuat gambarnya coba ganti prompt nya")

    await conn.sendMessage(m.chat, {
        image: {
            url: imageUrl
        },
        caption: `Gambar berhasil dibuat!\n Dengan Prompt: ${text}`
    }, {
        quoted: m
    })
}
handler.help = ['txt2img']
handler.tags = ['ai']
handler.command = /^(txt2img)$/i


module.exports = handler

async function generateImage(prompt) {
    try {
        let {
            data
        } = await axios.post("https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev", {
            prompt,
            size: "1024x1024",
            device_id: `dev-${Math.floor(Math.random() * 1000000)}`
        }, {
            headers: {
                "Content-Type": "application/json",
                Origin: "https://deepimg.ai",
                Referer: "https://deepimg.ai/"
            }
        })
        return data?.data?.images?.[0]?.url || null
    } catch (err) {
        console.error(err.response ? err.response.data : err.message)
        return null
    }
}