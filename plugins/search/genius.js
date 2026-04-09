import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} rumah ke rumah`);
  m.reply(global.wait);

  try {
    const res = await alfisy('/api/search/genius-search', { q: text });
    if (!res?.status) return m.reply('❌ Gagal mencari');

    const songs = res.result || [];
    if (!songs.length) return m.reply('❌ Lagu tidak ditemukan');

    // Ambil lagu pertama
    const s = songs[0].result;
    const detail = await alfisy('/api/search/genius-detail', { id: s.id });

    if (!detail?.status) return m.reply('❌ Gagal mengambil lirik');

    const d = detail.result;
    // Extract lyrics from DOM structure
    const lyrics = extractLyrics(d.lyrics?.dom) || 'Lirik tidak tersedia';
    
    let txt = `*GENIUS LYRICS*\n🎵 ${d.full_title}\n📅 ${d.release_date_for_display || '-'}\n🔗 ${d.url}\n\n${lyrics}`;

    if (d.song_art_image_url) {
      try {
        const buf = await downloadFile(d.song_art_image_url);
        conn.sendMessage(m.chat, { image: buf, caption: txt }, { quoted: m });
        return;
      } catch {}
    }
    m.reply(txt);
  } catch (e) { m.reply(`❌ Error: ${e.message}`); }
};

function extractLyrics(dom) {
  if (!dom) return '';
  let text = '';
  function walk(node) {
    if (!node) return;
    if (node.tag === 'br') { text += '\n'; return; }
    if (node.children) node.children.forEach(walk);
    if (typeof node === 'string') text += node;
    if (node.children?.[0]?.tag === 'a') walk(node.children[0]);
  }
  walk(dom);
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

handler.help = ['genius <query>'];
handler.tags = ['search'];
handler.command = /^(genius|lyrics|lirik)$/i;
handler.limit = 1;

export default handler;
