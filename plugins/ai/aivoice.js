//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/aivoice


const axios = require('axios');
const fs = require('fs');

const voiceList = [{
        id: "RWiGLY9uXI70QL540WNd",
        name: "Dokter brando"
    },
    {
        id: "v70fYBHUOrHA3AKIBjPq",
        name: "Mahaputra"
    },
    {
        id: "TMvmhlKUioQA4U7LOoko",
        name: "Andi"
    }
];


async function aiVoiceTTS(text = 'Powered By Anggazyy.', voiceId = 'RWiGLY9uXI70QL540WNd') {
    const apiKey = 'sk_c1f6b75d3bddb1cf58ce369234b1ee025f24a8e523d1662a'; // Ganti dengan API Key ElevenLabs kamu
    const outputPath = `voice_${Date.now()}.mp3`;

    try {
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.7,
                    similarity_boost: 0.5
                }
            }, {
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        fs.writeFileSync(outputPath, response.data);
        return outputPath;
    } catch (err) {
        console.error('[TTS ERROR]', err.message);
        return null;
    }
}

// Plugin handler
let handler = async (m, {
    client,
    text,
    command,
    isPrem
}) => {
    if (!text) {
        let list = `*📢 Daftar Suara Tersedia:*\n\n`;
        voiceList.forEach((v, i) => {
            list += `≭ ${i + 1} ${v.name}\n`;
        });
        return m.reply(list + `\n*Gunakan seperti ini:*\n.aivoice <nomor>|<teks>\n\n*Contoh:*\n.aivoice 1|Halo, Aku bot dari acodex.site.`);
    }

    const [indexStr, ...textParts] = text.split('|');
    const teks = textParts.join('|').trim();
    const index = parseInt(indexStr.trim()) - 1;

    if (isNaN(index) || !voiceList[index]) {
        return m.reply('Nomor suara tidak valid.');
    }

    if (!teks) return m.reply('Teks tidak boleh kosong.');

    const voiceId = voiceList[index].id;
    const audioPath = await aiVoiceTTS(teks, voiceId);

    if (!audioPath) return m.reply('Gagal mengubah teks menjadi suara.');

    await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(audioPath),
        mimetype: 'audio/mpeg',
        ptt: false
    }, {
        quoted: m
    });

    fs.unlinkSync(audioPath);
};

handler.command = ['aivoice'];
handler.tags = ['ai'];
handler.help = ['aivoice <nomor>|<teks>'];
handler.register = false;
handler.premium = false;
module.exports = handler;