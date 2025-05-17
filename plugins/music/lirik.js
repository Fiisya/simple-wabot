//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : music/lirik


const axios = require('axios');

const handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply('Masukkan judul lagu yang ingin dicari.');

    try {
        // Kirim permintaan ke API FastRest
        const res = await axios.get(`https://fastrestapis.fasturl.cloud/music/songlyrics-v1?text=${encodeURIComponent(text)}`);
        const data = res.data;

        // Periksa apakah respons berhasil
        if (data.status !== 200 || !data.result || !data.result.answer) {
            return m.reply('Lagu tidak ditemukan atau gagal mengambil data.');
        }

        // Ambil data dari respons
        const {
            answer
        } = data.result;
        const {
            song,
            artist,
            album,
            plain_lyrics,
            genre,
            year,
            Youtube_URL,
            album_artwork_url,
            preview_audio_url,
            related_songs,
        } = answer;

        // Format respons
        let response = `🎵 *${song || 'Judul tidak diketahui'}* - ${artist || 'Artis tidak diketahui'}\n`;
        if (album) response += `💿 Album: ${album}\n`;
        if (genre) response += `🎼 Genre: ${genre}\n`;
        if (year) response += `📅 Tahun: ${year}\n`;
        if (Youtube_URL) response += `📹 YouTube: ${Youtube_URL}\n`;

        // Tambahkan lirik
        response += `\n📜 *Lirik:*\n${plain_lyrics || 'Lirik tidak tersedia.'}`;

        // Siapkan contextInfo untuk thumbnail
        const contextInfo = {};
        if (album_artwork_url) {
            contextInfo.thumbnailUrl = album_artwork_url; // Tambahkan thumbnailUrl ke contextInfo
        }

        // Kirim pesan dengan conn.sendMessage
        await conn.sendMessage(m.chat, {
            text: response,
            contextInfo: {
                externalAdReply: {
                    title: song || 'Lagu',
                    body: artist || 'Artis',
                    thumbnailUrl: album_artwork_url || undefined, // Gunakan thumbnailUrl jika tersedia
                    sourceUrl: Youtube_URL || undefined, // Opsional: tautan YouTube
                    mediaType: 1, // 1 untuk gambar
                    renderLargerThumbnail: true, // Tampilkan thumbnail lebih besar
                },
                ...contextInfo, // Sertakan contextInfo tambahan
            },
        }, {
            quoted: m
        });

    } catch (err) {
        console.error('Error saat mencari lirik:', err.message);
        await m.reply('Gagal mengambil data lirik. Silakan coba lagi.');
    }
};

handler.help = ['lirik'];
handler.tags = ['music'];
handler.command = /^(lirik|lyrics)$/i;

module.exports = handler;