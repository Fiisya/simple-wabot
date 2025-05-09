//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : downloader/mediafire


const axios = require('axios');

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply('mohon masukan url');
    if (!text.includes('http')) return m.reply('mohon masukan url yang benar');
    const resmf = await axios.get('https://api.siputzx.my.id/api/d/mediafire?url=' + encodeURIComponent(text));
    m.reply('Mulai mendownload ');
    conn.sendFile(m.chat, resmf.data.data.downloadLink, resmf.data.data.downloadLink.split('/').pop(),
        `NAMA: ${resmf.data.data.fileName}
            SIZE: ${resmf.data.data.fileSize}
            TYPE: ${resmf.data.data.downloadLink.split('.').pop()}`, m);
}
handler.help = ['mediafire'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mf|mediafire)$/i;
handler.register = true
handler.limit = 3;

module.exports = handler;