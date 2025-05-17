//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/gem


const {
    uploadFile
} = require('cloudku-uploader');
const {
    Buffer
} = require('buffer');
const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text && !m.quoted) return m.reply("• *Contoh:* .gemini selamat pagi");

    const genAI = new GoogleGenerativeAI("AIzaSyDdfNNmvphdPdHSbIvpO5UkHdzBwx7NVm0");
    const geminiProModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro"
    });
    const geminiFlashModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    });

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    let prompt = text || (m.quoted && m.quoted.text) || "";

    try {
        let responseText, imageUrl;

        if (mime) {
            // Proses upload gambar ke CloudkuImages
            let fileBuffer = await q.download();
            let ext = mime.split('/')[1] || 'bin';
            let fileName = `upload.${ext}`;

            let uploadResult = await uploadFile(fileBuffer, fileName);
            if (uploadResult.status !== "success") return m.reply("⚠️ Gagal mengunggah gambar!");

            imageUrl = uploadResult.url;

            // Proses AI dengan gambar
            const imageResp = await fetch(imageUrl).then(res => res.arrayBuffer());
            const imageBase64 = Buffer.from(imageResp).toString("base64");

            let imagePart = {
                inlineData: {
                    data: imageBase64,
                    mimeType: mime
                }
            };

            let result = await geminiProModel.generateContent([imagePart, prompt]);
            responseText = result.response.text();
        } else {
            // Proses teks biasa
            let result = await geminiFlashModel.generateContent(prompt);
            responseText = result.response.text();
        }

        if (!responseText) throw new Error("Response tidak valid dari API");

        conn.sendMessage(m.chat, {
            text: responseText,
            contextInfo: {
                externalAdReply: {
                    title: 'GEMINI-PRO / VISION',
                    thumbnailUrl: imageUrl || 'https://telegra.ph/file/4bae3d5130aabcbe94588.jpg',
                    sourceUrl: 'https://gemini.google.com',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, {
            quoted: m
        });

    } catch (e) {
        console.error(e);
        m.reply(`⚠️ Terjadi kesalahan saat memproses permintaan. ${e.message}`);
    }
}
handler.help = ["gemini"].map((a) => a + " *[prompt]*");
handler.tags = ["ai"];
handler.command = ["gemini"];
module.exports = handler;