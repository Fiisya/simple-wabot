//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/jarak




const cheerio = require('cheerio');
const axios = require('axios');
let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    if (!text.includes(',')) return m.reply('Format salah! Gunakan: jarak [kota asal],[kota tujuan]\nContoh: jarak bekasi,madiun');

    let [from, to] = text.split(',').map(v => v.trim());
    let biyumaunyepong = `https://api.vreden.my.id/api/tools/jarak?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    try {
        let response = await fetch(biyumaunyepong);
        let data = await response.json();
        if (data.status !== 200) return m.reply('Gagal mendapatkan data jarak! Pastikan kota yang dimasukkan benar.');
        let result = data.result;
        let msg = `📍 *Informasi Jarak* 📍
 
🚗 *Dari:* ${result.asal.alamat} 
📍 *Ke:* ${result.tujuan.alamat} 
📏 *Jarak:* ${result.detail.split('menempuh jarak ')[1].split(',')[0]} 
⏳ *Estimasi Waktu:* ${result.detail.split('estimasi waktu ')[1]} 
⛽ *Estimasi BBM:* ${result.estimasi_biaya_bbm.total_liter} liter (~${result.estimasi_biaya_bbm.total_biaya})

🗺️ *Peta:* ${result.peta_statis}

📍 *Rute Perjalanan:* 
${result.arah_penunjuk_jalan.map(step => `🚘 ${step.instruksi} (${step.jarak})`).join('\n')}`;
        m.reply(msg);
    } catch (error) {
        console.error(error);
        m.reply('*Terjadi kesalahan saat mengambil data*');
    }
}
handler.help = ['jarak'].map(v => v + ' <place> - <place>')
handler.tags = ['internet']
handler.command = /^jarak|distance$/i

module.exports = handler