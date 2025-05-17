//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/cuaca


const axios = require('axios');

let handler = async (m, {
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) throw `*Example:* ${usedPrefix + command} Jakarta`;

    try {
        const location = args.join(' ');

        const response = await axios.get(`https://api.alfixd.my.id/api/cuaca?kota=${encodeURIComponent(location)}`);
        const data = response.data;

        if (!data || !data.result) throw "Location not found or API error";

        const weatherInfo = `
🌤️ *WEATHER INFORMATION* 🌤️
📍 *Location:* ${data.result.kota || 'Unknown'}
⏱️ *Time Zone:* ${data.result.zona_waktu || 'Unknown'}
🌡️ *Temperature:* ${data.result.suhu || 'Unknown'}
☁️ *Condition:* ${data.result.kondisi || 'Unknown'}
💧 *Humidity:* ${data.result.kelembaban || 'Unknown'}
🌬️ *Wind:* ${data.result.angin || 'Unknown'}
📊 *Pressure:* ${data.result.tekanan !== 'undefined mb' ? data.result.tekanan : 'Unknown'}

*Last Updated:* ${new Date().toLocaleString()}
`.trim();

        await m.reply(weatherInfo);

    } catch (error) {
        console.error('Weather command error:', error);
        await m.reply(`❌ Error: Couldn't get weather data for that location. Please try another location or try again later.`);
    }
};

handler.help = ['weather <location>'];
handler.tags = ['tools'];
handler.command = /^(weather|cuaca)$/i;
handler.limit = true;

module.exports = handler;