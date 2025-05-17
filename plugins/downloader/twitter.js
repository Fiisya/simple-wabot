//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : downloader/twitter


const fetch = require('node-fetch');
const axios = require('axios');

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) throw `Please provide a Twitter URL!\n\nExample:\n${usedPrefix + command} https://twitter.com/username/status/1234567890`;

    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });

        const url = args[0]
            .replace('x.com', 'twitter.com')
            .replace('www.', '')
            .split('?')[0];

        if (!url.includes('twitter.com/') || !url.includes('/status/')) {
            throw 'Invalid Twitter URL format!';
        }

        const apiUrl = `https://api.alfixd.my.id/api/twitterdl?url=${encodeURIComponent(url)}`;
        const {
            data
        } = await axios.get(apiUrl, {
            timeout: 20000
        });

        if (!data?.status || !data?.download_link?.length) {
            throw 'No downloadable content found';
        }

        const videoUrl = data.download_link[0];

        await conn.sendMessage(m.chat, {
            video: {
                url: videoUrl
            },
            caption: `🐦 Twitter Video\n🔗 Source: ${data.source}`,
            gifPlayback: false
        }, {
            quoted: m
        });

    } catch (e) {
        console.error('Error:', e);
        await conn.reply(m.chat, `❌ Failed to download: ${e.message || 'Invalid URL or private content'}`, m);
    }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = /^(twitter|twdl|twit|tw|twitterdl)$/i;
handler.limit = true;

module.exports = handler;