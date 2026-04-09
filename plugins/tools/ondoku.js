import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *ONDOKU TEXT TO SPEECH* 」\n│\n│ Ubah teks menjadi suara\n│\n│ Contoh:\n│ ${usedPrefix + command} halo selamat pagi\n│ ${usedPrefix + command} voice=id-ID-ArdiNeural | halo dunia\n│\n│ Voice populer:\n│ id-ID-ArdiNeural (Indonesia)\n│ en-US-AdamMultilingualNeural (English)\n│ ja-JP-KeitaNeural (Japanese)\n│ ko-KR-InJoonNeural (Korean)\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    let voice = 'id-ID-ArdiNeural';
    let query = text;

    if (text.includes('voice=')) {
      const parts = text.split('|').map(p => p.trim());
      voice = parts[0].match(/voice=(.+)/)?.[1]?.trim() || voice;
      query = parts[1] || parts[0];
    }

    const result = await alfisy('/api/tools/ondoku', {
      text: query,
      voice,
      speed: 1,
      pitch: 0,
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
      caption: `┌─⭓「 *ONDOKU TTS* 」\n│\n│ 🗣️ *Voice:* ${voice}\n│ 📝 *Text:* ${query}\n│\n└───────────────⭓\n> ${global.wm}`,
    }, { quoted: m });

  } catch (e) {
    console.error('[Ondoku Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['ondoku <text>'];
handler.tags = ['tools'];
handler.command = /^(ondoku|tts2|texttospeech2)$/i;
handler.limit = 1;

export default handler;
