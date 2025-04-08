//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : downloader/capcut




const fetch = require('node-fetch');

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) {
        throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://www.capcut.com/template-detail/7273798219329441025?template_id=7273798219329441025&share_token=1ea9b68c-aa1b-4fc4-86c2-bf2b9136b6e0&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1`;
    }

    try {
        if (!args[0].match(/capcut/gi)) {
            throw `URL Tidak Ditemukan!`;
        }
        m.reply('*Mohon tunggu..*');

        const response = await fetch(`https://api.vreden.my.id/api/capcutdl?url=${args[0]}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        const {
            url,
            title,
            size
        } = res.result;

        await conn.sendFile(m.chat, url, 'capcut.mp4', `Title: ${title}\n\nSize: ${size}`, m);

    } catch (e) {
        console.log(e);
        throw `Terjadi Kesalahan!`;
    }
};

handler.command = ['capcut', 'cc'];
handler.tags = ['downloader'];
handler.help = ['capcut *url*'];
handler.limit = true;
module.exports = handler;