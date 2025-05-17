//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/tiktokstalk


/* tiktok stalk cjs bebas klaim wm😜😜
Scrape ins:https://whatsapp.com/channel/0029VadJEZZ8aKvCkRJsAE2Z
*/
const fetch = require('node-fetch');
const cheerio = require("cheerio");

const handler = async (m, {
    text,
    args,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply(`• Contoh:\n${usedPrefix + command} ins_mys3lv`)

    try {
        const url = await fetch(`https://tiktok.com/@${text}`, {
            headers: {
                'User-Agent': 'Insdev/7.32.2'
            }
        });
        const html = await url.text();
        const $ = cheerio.load(html);
        const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
        const result = JSON.parse(data);

        if (result['__DEFAULT_SCOPE__']['webapp.user-detail'].statusCode !== 0) {
            return m.reply('• Pengguna tidak ditemukan!')
        }

        const res = result['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo'];

        let teks = `• Username: @${res.user.uniqueId}
• Nama: ${res.user.nickname}
• Followers: ${res.stats.followerCount}
• Mengikuti: ${res.stats.followingCount}
• Video: ${res.stats.videoCount}
• Likes: ${res.stats.heartCount}
• Bio: ${res.user.signature || '-'}
• Verified: ${res.user.verified ? 'Ya' : 'Tidak'}`
        m.reply(teks)

    } catch (err) {
        m.reply('• Terjadi kesalahan saat memproses permintaan')
        console.log(err)
    }
}

handler.help = ['tiktokstalk'].map(v => v + ' <username>')
handler.tags = ['internet']
handler.command = /^tiktokstalk$/i

module.exports = handler