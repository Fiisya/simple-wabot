import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} jakarta`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/tools/weather', { q: text });
    if (!res?.success) return m.reply('❌ Gagal');
    const d = res.result;
    const emoji = d.weather.toLowerCase().includes('cloud') ? '☁️' : d.weather.toLowerCase().includes('rain') ? '🌧️' : '☀️';
    
    m.reply(`*WEATHER*\n${emoji} ${d.city}, ${d.country}\n${d.weather} - ${d.description}\n🌡️ ${d.temperature.current}°C (feels ${d.temperature.feels_like}°C)\n💧 ${d.humidity}% | 🌬️ ${d.wind.speed} m/s`);
  } catch (e) {
    console.error('[Weather Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['weather <city>'];
handler.tags = ['tools'];
handler.command = /^(weather|cuaca)$/i;
handler.limit = 1;

export default handler;
