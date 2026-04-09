# 🤖 ayanaMD

> WhatsApp Bot multifungsi berbasis **Baileys** dengan sistem plugin modular dan ESM (ES Modules).

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-7.0.0--rc.9-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)

[![Stars](https://img.shields.io/github/stars/Fiisya/simple-wabot?style=for-the-badge)](https://github.com/Fiisya/simple-wabot/stargazers)
[![Forks](https://img.shields.io/github/forks/Fiisya/simple-wabot?style=for-the-badge)](https://github.com/Fiisya/simple-wabot/network/members)
[![Issues](https://img.shields.io/github/issues/Fiisya/simple-wabot?style=for-the-badge)](https://github.com/Fiisya/simple-wabot/issues)

</div>

---

## 📋 Daftar Isi

- [✨ Fitur](#-fitur)
- [📦 Instalasi](#-instalasi)
- [⚙️ Konfigurasi](#️-konfigurasi)
- [🚀 Cara Penggunaan](#-cara-penggunaan)
- [📁 Struktur Proyek](#-struktur-proyek)
- [📝 Membuat Plugin](#-membuat-plugin)
- [🔧 Dependensi Utama](#-dependensi-utama)
- [🤝 Kontribusi](#-kontribusi)
- [📜 Lisensi](#-lisensi)
- [💬 Kontak](#-kontak)

---

## ✨ Fitur

| Kategori | Deskripsi |
|----------|-----------|
| 🔌 **Plugin System** | Hot-reload otomatis dengan chokidar, tanpa perlu restart bot |
| 💾 **Database** | JSON database otomatis untuk setiap user & grup |
| 🎯 **Handler** | Sistem handler modular dengan prefix commands yang fleksibel |
| 👋 **Welcome/Goodbye** | Pesan selamat datang & perpisahan otomatis untuk member grup |
| 🔗 **Antilink** | Deteksi & hapus link grup secara otomatis |
| 📊 **Level & EXP** | Sistem leveling berbasis aktivitas chat |
| 👑 **Premium & Limit** | Manajemen akses premium & batasan penggunaan |
| 🎨 **Sticker** | Buat sticker dari gambar/video/gif dengan exif custom |
| 🔄 **Converter** | Konversi audio & video dengan FFmpeg |

---

## 📦 Instalasi

### Prasyarat
- **Node.js** >= 18.x
- **Git** (opsional)
- **FFmpeg** (untuk fitur converter & sticker)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Fiisya/simple-wabot.git
cd simple-wabot

# 2. Install dependencies
npm install

# 3. Jalankan bot
node index.js
```

### Pertama Kali Menjalankan
Saat pertama kali dijalankan, bot akan:
1. Membuat `database.json` secara otomatis
2. Menampilkan **QR Code** atau **Pairing Code** di terminal
3. Scan QR dengan WhatsApp > Linked Devices

---

## ⚙️ Konfigurasi

Edit file **`config.js`** sesuai kebutuhan:

```js
export default {
  // Nomor owner (format: tanpa +, contoh: 6281234567890)
  owner: ['6281234567890'],
  
  // Metode login: true = Pairing Code, false = QR Code
  isPairing: false,
  
  // Self mode: true = bot hanya merespon owner
  selfMode: false,
  
  // Prefix command (bisa custom)
  prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^/€^,£,;:°•,|,/*-]/i,
  
  // Nama bot
  botName: 'ayanaMD',
  
  // Owner name
  ownerName: 'KennDev',
  
  // Session folder
  sessionName: 'session',
};
```

---

## 🚀 Cara Penggunaan

### Scan QR Code
```bash
node index.js
# Scan QR yang muncul di terminal
```

### Menggunakan Pairing Code
```bash
# Ubah isPairing: true di config.js
node index.js
# Masukkan nomor WhatsApp, lalu masukkan pairing code di HP
```

### Command Dasar
| Command | Deskripsi |
|---------|-----------|
| `.menu` | Menampilkan daftar semua command |
| `.ping` | Cek kecepatan response bot |
| `.profile` | Lihat profil & level user |
| `.sticker` | Buat sticker dari gambar/video |
| `.antilink on/off` | Aktifkan/nonaktifkan antilink (admin only) |

> 💡 Bot merespon command dengan prefix sesuai konfigurasi di `config.js`

---

## 📁 Struktur Proyek

```
ayanaMD/
├── config.js              # Konfigurasi utama bot
├── main.js                # Entry point Baileys connection
├── index.js               # Auto-restart wrapper
├── handler.js             # Message handler & plugin loader
├── run.js                 # Alternative runner
├── database.json          # Database (auto-generated)
├── package.json           # Dependencies & scripts
│
├── lib/                   # Library modular
│   ├── api.js             # API helpers
│   ├── converter.js       # FFmpeg audio/video converter
│   ├── database.js        # Database initialization per user/chat
│   ├── print.js           # Terminal logger
│   ├── serialize.js       # Message serializer + conn methods
│   └── sticker.js         # Sticker creator (webp + exif)
│
├── plugins/               # Plugin directory
│   ├── _event/            # Auto-events (antilink, welcome, dll)
│   ├── info/              # Info commands (menu, ping, profile)
│   ├── group/             # Group management
│   ├── owner/             # Owner-only commands
│   ├── sticker/           # Sticker tools
│   ├── tools/             # Utilities
│   ├── fun/               # Fun commands
│   └── game/              # Games
│
├── session/               # Auth session (auto-generated)
├── tmp/                   # Temporary files
└── README.md              # Dokumentasi ini
```

---

## 📝 Membuat Plugin

Buat file baru di folder `plugins/` dengan kategori yang sesuai:

```js
// plugins/kategori/namaplugin.js

const handler = async (m, { conn, args, text, isOwner }) => {
  await m.reply('Halo! Ini plugin custom saya.');
};

// Metadata plugin
handler.help    = ['namacommand'];
handler.tags    = ['kategori'];
handler.command  = /^namacommand$/i;

// Opsional: Restriction flags
handler.owner    = true;   // Hanya owner yang bisa pakai
handler.premium  = true;   // Hanya user premium
handler.group    = true;   // Hanya di grup
handler.private  = true;   // Hanya di private chat
handler.admin    = true;   // Hanya admin grup
handler.botAdmin = true;   // Bot harus jadi admin

export default handler;
```

### Parameter Handler

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `m` | Object | Message object (serialized) |
| `conn` | Object | WhatsApp connection instance |
| `args` | Array | Array argumen dari pesan |
| `text` | String | Full text setelah command |
| `isOwner` | Boolean | Status owner user |

---

## 🔧 Dependensi Utama

| Package | Versi | Deskripsi |
|---------|-------|-----------|
| `@whiskeysockets/baileys` | ^7.0.0-rc.9 | WhatsApp Web API |
| `chalk` | ^5.x | Terminal styling (ESM only) |
| `node-fetch` | ^3.x | HTTP client (ESM only) |
| `file-type` | ^19.x | File type detection (ESM only) |
| `chokidar` | ^3.x | File watcher untuk hot-reload |
| `fluent-ffmpeg` | ^2.x | FFmpeg wrapper untuk converter |

---

## 🤝 Kontribusi

Kontribusi sangat dihargai! Cara berkontribusi:

1. **Fork** repository ini
2. Buat **feature branch** (`git checkout -b feature/fitur-baru`)
3. **Commit** perubahan (`git commit -m 'Menambahkan fitur X'`)
4. **Push** ke branch (`git push origin feature/fitur-baru`)
5. Buka **Pull Request**

### Guidelines
- Pastikan semua plugin menggunakan ESM syntax (`export default`)
- Test plugin sebelum submit PR
- Ikuti struktur folder yang sudah ada
- Tambahkan `handler.help`, `handler.tags`, dan `handler.command`

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail.

---

## 💬 Kontak

**Fiisya**  
- GitHub: [@Fiisya](https://github.com/Fiisya)
- WhatsApp: [Owner](https://wa.me/6281234567890)

---

<div align="center">
  
  ⭐ **Star repo ini jika bermanfaat!** ⭐
  
  Made with ❤️ by **KennDev X AlfiXD**
  
</div>
