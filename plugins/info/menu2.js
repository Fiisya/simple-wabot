//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/menu2


const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia,
} = require('baileys');

process.env.TZ = 'Asia/Jakarta';
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const moment = require('moment-timezone');

const arrayMenu = ['all', 'main', 'fun', 'islami', 'info', 'ai', 'quotes', 'downloader', 'premium', 'music', 'maker', 'game', 'group', 'internet', 'owner', 'rpg', 'saluran', 'sticker', 'tools'];

const allTags = arrayMenu.reduce((acc, tag) => {
    acc[tag] = `MENU ${tag.toUpperCase()}`;
    return acc;
}, {
    all: 'SEMUA MENU'
});

const defaultMenu = {
    before: `Hi %name 👋\nSaya adalah bot WhatsApp otomatis yang dapat membantu Anda dengan berbagai tugas dan informasi hanya melalui WhatsApp.\n\n◦ *Library:* Baileys\n◦ *Fungsi:* Asisten\n\n–   *BOT INFORMATION*\n┌  ◦ Uptime: %uptime\n│  ◦ Tanggal: %date\n│  ◦ Waktu: %time\n└  ◦ Prefix: *[ %_p ]*`.trimStart(),
    header: `–  *%category* \n┌  `,
    body: `│  ◦ %cmd %islimit %isPremium`,
    footer: `└  `,
    after: ``
};

const handler = async (m, {
    conn,
    usedPrefix: _p,
    args = [],
    command
}) => {
    await conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key
        }
    })
    try {
        const {
            exp,
            limit,
            level
        } = global.db.data.users[m.sender] || {};
        const name = `@${m.sender.split`@`[0]}`;
        const teks = (args[0] || '').toLowerCase().trim();

        // Format waktu dan tanggal
        const d = new Date();
        const date = d.toLocaleDateString('id', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const time = d.toLocaleTimeString('id', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        const uptime = clockString(process.uptime() * 1000);

        // Mengambil daftar perintah dari plugins
        const help = Object.values(global.plugins)
            .filter(plugin => !plugin.disabled && plugin.help && plugin.tags)
            .map(plugin => ({
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                limit: !!plugin.limit,
                premium: !!plugin.premium
            }));

        // Jika tidak ada argumen, tampilkan daftar menu
        if (!teks) {
            const menuList = `${defaultMenu.before}\n\n${defaultMenu.after}`;
            return await sendMenu(m, conn, menuList, {
                name,
                uptime,
                date,
                time,
                _p
            });
        }

        // Jika argumen adalah 'all', tampilkan semua menu
        if (teks === 'all') {
            let allMenus = `${defaultMenu.before}\n\n`;
            for (const tag of arrayMenu) {
                const categoryCommands = help.filter(menu => menu.tags.includes(tag));
                if (categoryCommands.length) {
                    allMenus += `${defaultMenu.header.replace(/%category/g, allTags[tag])}\n`;
                    for (const menu of categoryCommands) {
                        for (const cmd of menu.help) {
                            allMenus += defaultMenu.body
                                .replace(/%cmd/g, _p + cmd)
                                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n';
                        }
                    }
                    allMenus += `${defaultMenu.footer}\n\n`;
                }
            }
            allMenus += defaultMenu.after;
            return await sendMenu(m, conn, allMenus, {
                name,
                uptime,
                date,
                time,
                _p
            });
        }

        // Validasi kategori
        if (!allTags[teks]) {
            return conn.reply(m.chat, `Menu "${teks}" tidak tersedia.\nSilakan ketik ${_p}menu untuk melihat daftar menu.`, m);
        }

        // Tampilkan menu berdasarkan kategori
        const categoryCommands = help.filter(menu => menu.tags.includes(teks));
        if (!categoryCommands.length) {
            return conn.reply(m.chat, `Tidak ada perintah dalam kategori "${teks}".`, m);
        }

        let menuCategory = `${defaultMenu.before}\n\n${defaultMenu.header.replace(/%category/g, allTags[teks])}\n`;
        for (const menu of categoryCommands) {
            for (const cmd of menu.help) {
                menuCategory += defaultMenu.body
                    .replace(/%cmd/g, _p + cmd)
                    .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                    .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n';
            }
        }
        menuCategory += `${defaultMenu.footer}\n\n${defaultMenu.after}`;
        return await sendMenu(m, conn, menuCategory, {
            name,
            uptime,
            date,
            time,
            _p
        });

    } catch (e) {
        console.error('Error in menu handler:', e);
        return conn.reply(m.chat, 'Maaf, terjadi kesalahan saat memproses menu. Coba lagi nanti.', m);
    }
};

handler.help = ['bot'];
handler.tags = ['main'];
handler.command = /^(bot)$/i;
handler.exp = 3;

module.exports = handler;
async function sendMenu(m, conn, text, replace) {
    const thumbnailUrl = 'https://raw.githubusercontent.com/Fiisya/uploads/main/uploads/1747336545556.jpeg';

    // Ambil media thumbnail
    let media;
    try {
        const response = await fetch(thumbnailUrl);
        if (!response.ok) throw new Error('Gambar tidak tersedia');
        media = await prepareWAMessageMedia({
            image: {
                url: thumbnailUrl
            }
        }, {
            upload: conn.waUploadToServer
        });
    } catch (e) {
        console.warn('Gagal mengambil media:', e.message);
        media = {};
    }

    // Daftar emoji untuk tiap kategori
    const categoryEmojis = {
        all: '🌐', // All
        main: '🔑', // Main
        fun: '🎉', // Fun
        islami: '☪️', // Islami
        info: 'ℹ️', // Info
        ai: '🤖', // AI
        quotes: '💬', // Quotes
        downloader: '⬇️', // Downloader
        premium: '💎', // Premium
        music: '🎶', // Music
        maker: '🛠️', // Maker
        game: '🎮', // Game
        group: '👥', // Group
        internet: '🌍', // Internet
        owner: '👑', // Owner
        rpg: '🗡️', // RPG
        saluran: '💰', // Total Saluran
        sticker: '🖼️', // Sticker
        tools: '🔧' // Tools
    };

    // Buat daftar rows dari arrayMenu dengan emoji di depan
    const rows = arrayMenu.map(tag => ({
        header: `[ ${allTags[tag]} ]`, // Menambahkan header untuk setiap item
        title: `${categoryEmojis[tag]} ${allTags[tag]}`, // Emoji di depan
        description: `Menampilkan menu kategori ${tag}`,
        id: `.bot ${tag}`
    }));

    // Cuma 1 section, title custom
    const sections = [{
        title: 'Pilihan Menu', // Title yang tetap sama
        highlight_label: 'Populer Plugins',
        rows
    }];

    // Buat pesan interaktif
    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363386031513012@newsletter',
                            newsletterName: 'Powered By Asyl',
                            serverMessageId: -1
                        },
                        externalAdReply: {
                            title: 'AsylBotz',
                            body: 'Versi: 1.0.2-beta',
                            thumbnailUrl,
                            sourceUrl: 'https://alfisyl.my.id',
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: false
                        }
                    },
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: text.replace(/%\w+/g, match => replace[match.slice(1)] || match)
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: 'Klik tombol di bawah untuk melihat daftar menu'
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: '',
                        subtitle: 'Asyl',
                        hasMediaAttachment: !!media.imageMessage,
                        ...media
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: 'Silakan pilih menu', // Title dropdown
                                    sections
                                })
                            },
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'Ping',
                                    id: '.ping'
                                })
                            },
                            {
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'Owner',
                                    url: 'https://www.alfisyl.my.id',
                                    merchant_url: 'https://www.alfisyl.my.id'
                                })
                            }
                        ]
                    })
                })
            }
        }
    }, {
        userJid: m.chat,
        quoted: m
    });

    // Kirim pesan
    await conn.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}

function clockString(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}