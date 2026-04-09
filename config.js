import moment from 'moment-timezone';

/*────────────────────────────────────────
   ayanaMD by KennDev – Config
────────────────────────────────────────*/

// ─── OWNER ────────────────────────────
global.owner      = ['628xxx'];          // nomor owner (tanpa +)
global.nameowner  = 'KennDev';
global.nomorown   = '628xxx';

// ─── BOT ──────────────────────────────
global.namebot    = 'ayanaMD';
global.version    = '1.0.0';
global.wm         = '© ayanaMD by KennDev';
global.packname   = 'ayanaMD';
global.author     = 'KennDev';
global.isPairing  = true;          // true = pairing code, false = QR
global.gconly     = false;         // true = group only mode
global.selfMode   = false;         // true = self / owner only

// ─── LINK ─────────────────────────────
global.sourceUrl  = 'https://github.com/KennDev/ayanaMD';
global.sgc        = 'https://chat.whatsapp.com/xxxx';

// ─── THUMBNAIL ────────────────────────
global.thumb      = 'https://cdn.alfisy.my.id/direct/236249.jpeg';

// ─── PESAN SISTEM ─────────────────────
global.wait       = '*⏳ Loading…* Mohon tunggu sebentar';
global.eror       = '*❌ Error System*';
global.done       = `*✅ Berhasil*\n> © ayanaMD by KennDev`;
global.maxwarn    = 3;

// ─── RPG / DEKOR ──────────────────────
global.htki = '*──────『';
global.htka = '』──────*';

// ─── QUOTED / FAKE STATUS ─────────────
global.fakestatus = (txt) => ({
  key: { remoteJid: '0@s.whatsapp.net', participant: '0@s.whatsapp.net', id: '' },
  message: { conversation: txt },
});

global.fkontak = {
  key: {
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'ayanaMD',
  },
  message: {
    contactMessage: {
      vcard: [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Dev;Kenn;;;',
        'FN:KennDev',
        `item1.TEL;waid='${global.nomorown}':'${global.nomorown}'`,
        'item1.X-ABLabel:Ponsel',
        'END:VCARD',
      ].join('\n'),
    },
  },
  participant: `${global.nomorown}@s.whatsapp.net`,
};

// ─── HELPER ───────────────────────────
global.capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

global.pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

global.tanggal = (numer) => {
  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const d = new Date(numer);
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};
