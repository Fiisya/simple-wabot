//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/ocr


const {
    GoogleGenerativeAI
} = require('@google/generative-ai');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI('AIzaSyA6M9JsIsaP76MZm2NZheWQkPIDJ01Koic');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

// Upload gambar dan ambil raw URL
async function alfixdRaw(fileBuffer) {
    try {
        const form = new FormData();
        form.append('file', fileBuffer, {
            filename: 'upload.jpg'
        });

        const response = await fetch('https://upfilegh.alfiisyll.biz.id/upload', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        const rawUrl = $('#rawUrlLink').attr('href');

        if (!rawUrl) throw new Error('Gagal mengambil URL gambar mentah.');
        return rawUrl;
    } catch (error) {
        console.error('[alfixdRaw] Upload error:', error.message);
        return null;
    }
}

// Request ke Gemini dengan retry
async function generateGeminiContentWithRetry(parts, maxRetries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent({
                contents: [{
                    parts
                }]
            });
            return result.response.text();
        } catch (error) {
            const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded');
            if (isOverloaded && attempt < maxRetries) {
                console.warn(`Gemini retry ${attempt}/${maxRetries}...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Layanan Gemini masih sibuk setelah beberapa percobaan.');
}

// Handler untuk digunakan di bot CJS
const handler = async (m, {
    conn
}) => {
    await conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key
        }
    });

    const client = m.isQuoted ? m.quoted : m;
    if (!/image/.test(client.mimetype || client.msg?.mimetype)) {
        throw 'Maaf, kirim atau reply gambar untuk OCR!';
    }

    try {
        const media = await client.download();
        const prompt = 'OCR gambar ini tanpa kata-kata tambahan, hanya teks dari gambar.';

        // Coba inlineData
        let text = await generateGeminiContentWithRetry([{
                text: prompt
            },
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: media.toString('base64')
                }
            }
        ]);

        // Fallback ke URL jika kosong
        if (!text || !text.trim()) {
            const imageUrl = await alfixdRaw(media);
            if (!imageUrl) throw new Error('Upload ke server gagal.');

            text = await generateGeminiContentWithRetry([{
                    text: prompt
                },
                {
                    image: {
                        url: imageUrl
                    }
                }
            ]);
        }

        m.reply(text || '❌ Tidak dapat mendeteksi teks pada gambar.');
    } catch (e) {
        console.error('OCR Error:', e);
        m.reply(`❌ Maaf, terjadi kesalahan saat melakukan OCR.\n\n${e.message || e}`);
    }
};

handler.help = ["ocr"];
handler.tags = ["tools"];
handler.premium = false;
handler.limit = true;
handler.command = ["ocr"];

module.exports = handler;