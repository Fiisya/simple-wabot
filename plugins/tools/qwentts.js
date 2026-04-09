import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *QWEN TEXT TO SPEECH* 」\n│\n│ Ubah teks menjadi suara Qwen AI\n│\n│ Contoh:\n│ ${usedPrefix + command} halo selamat pagi\n│ ${usedPrefix + command} voice=cherry | hello world\n│\n│ Voice tersedia:\n│ dylan, sunny, jada, cherry, ethan, serena, chelsie\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    let voice = 'dylan';
    let query = text;

    if (text.includes('voice=')) {
      const parts = text.split('|').map(p => p.trim());
      voice = parts[0].match(/voice=(\S+)/)?.[1] || 'dylan';
      query = parts[1] || parts[0];
    }

    const result = await alfisy('/api/tools/qwentts', {
      text: query,
      voice,
    });

    if (!result || !result.status) {
      return m.reply('❌ ' + (result?.message || 'Gagal convert teks ke suara.'));
    }

    const audioUrl = result.result?.audio_url || result.result?.url || result.audio_url;

    if (!audioUrl) {
      return m.reply('❌ URL audio tidak ditemukan.');
    }

    const buffer = await downloadFile(audioUrl);

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      ptt: false,
      caption: `┌─⭓「 *QWEN TTS* 」\n│\n│ 🗣️ *Voice:* ${voice}\n│ 📝 *Text:* ${query}\n│\n└───────────────⭓\n> ${global.wm}`,
    }, { quoted: m });

  } catch (e) {
    console.error('[QwenTTS Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['qwentts <text>'];
handler.tags = ['tools'];
handler.command = /^(qwentts|qwetts|qwen)$/i;
handler.limit = 1;

export default handler;
