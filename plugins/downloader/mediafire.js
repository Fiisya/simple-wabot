//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : downloader/mediafire


/*
- PLUGINS MEDIAFIRE
- Thanks untuk pembuat scrape ini
- Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
- Ar sens
*/
const fetch = require('node-fetch');
const {
    lookup
} = require('mime-types');
//import fetch from 'node-fetch';
//import { lookup } from "mime-types";

async function MediaFire(url) {
    try {
        const response = await fetch(`https://r.jina.ai/${url}`);
        const text = await response.text();

        const result = {
            filename: '',
            size: '',
            mimetype: '',
            url: '',
            repair: ''
        };

        const fileMatch = url.match(/\/file\/[^\/]+\/([^\/]+)/);
        if (fileMatch) result.filename = decodeURIComponent(fileMatch[1]);

        let ext = result.filename.split(".").pop();
        if (ext) result.mimetype = lookup(ext.toLowerCase()) || `application/${ext}`;

        const matchUrl = text.match(/(https:\/\/download\d+\.mediafire\.com\/[^\s"]+)/);
        if (matchUrl) result.url = matchUrl[1];

        const matchSize = text.match(/(\d+(\.\d+)?[KMGT]B)/);
        if (matchSize) result.size = matchSize[1];

        if (!result.url) return {
            error: "Gagal mendapatkan link download."
        };

        return result;
    } catch (error) {
        return {
            error: error.message
        };
    }
}

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply('*Mana link MediaFire-nya?*');

    try {
        let result = await MediaFire(text);

        if (result.error) {
            return m.reply(`*${result.error}*`);
        }

        let caption = `┌──⭓ *MEDIAFIRE DOWNLOADER*  
│ *Nama:* ${result.filename}  
│ *Ukuran:* ${result.size}  
└───────────⭓  
> Request By ${m.pushName}`;

        await conn.sendMessage(m.chat, {
            text: caption
        }, m);
        await conn.sendMessage(m.chat, {
            document: {
                url: result.url
            },
            mimetype: result.mimetype,
            fileName: result.filename
        }, m);
    } catch (error) {
        console.error(error);
        m.reply('*Terjadi kesalahan saat mengambil link MediaFire.*');
    }
};

handler.help = ['mediafire'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mf|mediafire)$/i;
handler.register = true
handler.limit = 3;

//export default handler;
module.exports = handler;