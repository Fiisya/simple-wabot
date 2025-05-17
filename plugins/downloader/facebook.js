/*Code By Nazir
 * Credits : Nazir
 * GcBot : https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP
 * !Note : Jangan Perjualbelikan Script ini tanpa izin @Nazir
 */

const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function getmyfb(urlFb) {
    try {
        const form = new FormData();
        form.append('id', urlFb);
        form.append('locale', 'id');

        const response = await axios.post('https://getmyfb.com/process', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const title = $('.results-item-text').text().trim();
            const thumbnail = $('.results-item-image').attr('src');
            const urlHd = $('.results-list li:nth-child(1) a').attr('href');
            const urlSd = $('.results-list li:nth-child(2) a').attr('href');
            return {
                title: title,
                thumb: thumbnail,
                video: {
                    hd: urlHd,
                    sd: urlSd,
                },
            };
        } else {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) {
        return m.reply(`*Example:* ${usedPrefix + command} <input url>`);
    }
    if (!args[0].match(/facebook|fb\.watch/gi)) {
        return m.reply('Please provide a valid Facebook video URL.');
    }

    try {
        const result = await getmyfb(args[0]);
        if (result.video.hd) {
            await conn.sendMessage(m.chat, {
                video: {
                    url: result.video.hd
                },
            }, {
                quoted: m
            });
        }
        if (result.video.sd) {
            await conn.sendMessage(m.chat, {
                video: {
                    url: result.video.sd
                },
            }, {
                quoted: m
            });
        }
    } catch (error) {
        console.error(error);
        m.reply(`Error: ${error.message}`);
    }
};

handler.help = ['fbdl'];
handler.command = /^(fbdl|facebookdl|fb|fbhd|fbdown)$/i;
handler.limit = false;

module.exports = handler;