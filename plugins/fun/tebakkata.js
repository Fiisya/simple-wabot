import fetch from 'node-fetch';

const sessions = {};

const handler = async (m, { conn }) => {
  if (sessions[m.chat]) return m.reply('Ada game yang sedang berlangsung! Ketik .stoptebak untuk berhenti.');
  await m.reply(global.wait);

  const res  = await fetch('https://api.betabotz.eu.org/api/game/tebakkata?apikey=free');
  const data = await res.json();
  if (!data?.result) return m.reply('Gagal mengambil soal!');

  const { soal, jawaban } = data.result;
  sessions[m.chat] = { jawaban: jawaban.toLowerCase(), waktu: Date.now() };

  await conn.sendMessage(m.chat, {
    text: `🎮 *TEBAK KATA*\n\n❓ ${soal}\n\nKamu punya *60 detik* untuk menjawab!\nFormat jawaban langsung ketik kata nya.`,
    contextInfo: {
      externalAdReply: { title: 'Tebak Kata', body: global.wm, thumbnailUrl: global.thumb, mediaType: 1 },
    },
  }, { quoted: m });

  setTimeout(() => {
    if (sessions[m.chat]) {
      delete sessions[m.chat];
      conn.sendMessage(m.chat, { text: `⏰ Waktu habis! Jawaban: *${jawaban}*` });
    }
  }, 60_000);
};

handler.all = async function (m) {
  if (!sessions[m.chat]) return;
  if (m.isBaileys || m.fromMe) return;
  const sess = sessions[m.chat];
  if (m.text?.toLowerCase().trim() === sess.jawaban) {
    delete sessions[m.chat];
    
    // FIX: Normalisasi JID untuk menghindari LID
    const senderJid = this.getJid ? this.getJid(m.sender) : this.decodeJid(m.sender);
    const senderNormal = senderJid.endsWith('@lid') ? m.sender : senderJid;
    const senderNum = senderNormal.split('@')[0];
    
    const user = global.db.data.users[senderNormal];
    if (user) { user.exp += 500; user.money += 1000; }
    await this.sendMessage(m.chat, { text: `✅ *BENAR!* @${senderNum}\n\n+500 EXP | +1000 Koin`, mentions: [senderNormal] });
  }
};

handler.help    = ['tebakkata'];
handler.tags    = ['game'];
handler.command = /^(tebakkata|tebak)$/i;
export default handler;
