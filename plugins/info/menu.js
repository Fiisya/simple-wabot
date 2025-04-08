//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/menu


//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : menu


let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let axios = require('axios')
let os = require('os')
let {
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia
} = require("baileys")
let moment = require('moment-timezone')
let {
    sizeFormatter
} = require('human-readable')
let format = sizeFormatter({
    std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})
Styles = (text, style = 1) => {
    var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    var yStr = Object.freeze({
        1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
    });
    var replacer = [];
    xStr.map((v, i) => replacer.push({
        original: v,
        convert: yStr[style].split('')[i]
    }));
    var str = text.toLowerCase().split('');
    var output = [];
    str.map(v => {
        const find = replacer.find(x => x.original == v);
        find ? output.push(find.convert) : output.push(v);
    });
    return output.join('');
};
const defaultMenu = {
    before: ``.trimStart(),
    header: `≡ *%category*
┌`,
    body: '│➤ %cmd',
    footer: `└`,
    after: ``,
}
let handler = async (m, {
    conn,
    usedPrefix: _p,
    args,
    command
}) => {
    await conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key
        }
    })
    let tags
    let teks = `${args[0]}`.toLowerCase()
    let arrayMenu = ['anonymous', 'main', 'fun', 'islami', 'info', 'ai', 'bug', 'jadibot', 'quotes', 'store', 'ephoto', 'downloader', 'textprome', 'nsfw', 'convert', 'premium', 'music', 'maker', 'game', 'group', 'panel', 'internet', 'hengker', 'owner', 'rpg', 'totalsaluran', 'sticker', 'tools', 'anime', 'convert']
    if (!arrayMenu.includes(teks)) teks = '404'
    if (teks == 'anonymous') tags = {
        anonymous: 'ANONYMOUS'
    }
    if (teks == 'downloader') tags = {
        downloader: 'DOWNLOADER'
    }
    if (teks == 'ai') tags = {
        ai: 'AI'
    }
    if (teks == 'convert') tags = {
        convert: 'convert'
    }
    if (teks == 'main') tags = {
        main: 'MAIN'
    }
    if (teks == 'totalsaluran') tags = {
        totalsaluran: 'SALURAN'
    }
    if (teks == 'premium') tags = {
        premium: 'PREMIUM'
    }
    if (teks == 'game') tags = {
        game: 'GAME'
    }
    if (teks == 'convert') tags = {
        convert: 'CONVERT'
    }
    if (teks == 'maker') tags = {
        maker: 'MAKER'
    }
    if (teks == 'group') tags = {
        group: 'GROUP'
    }
    if (teks == 'panel') tags = {
        panel: 'PANEL'
    }
    if (teks == 'music') tags = {
        music: 'MUSIC'
    }
    if (teks == 'anonymous') tags = {
        anonymous: 'ANONYMOUS'
    }
    if (teks == 'quotes') tags = {
        quotes: 'QUOTES'
    }
    if (teks == 'fun') tags = {
        fun: 'FUN'
    }
    if (teks == 'islami') tags = {
        islami: 'ISLAMI'
    }
    if (teks == 'textprome') tags = {
        textprome: 'TEXTPROME'
    }
    if (teks == 'store') tags = {
        store: 'STORE'
    }
    if (teks == 'bug') tags = {
        bug: 'BUG'
    }
    if (teks == 'jadibot') tags = {
        jadibot: 'JADIBOT'
    }
    if (teks == 'nsfw') tags = {
        nsfw: 'NSFW'
    }
    if (teks == 'internet') tags = {
        internet: 'INTERNET'
    }
    if (teks == 'hengker') tags = {
        hengker: 'HENGKER'
    }
    if (teks == 'ephoto') tags = {
        ephoto: 'EPHOTO'
    }
    if (teks == 'owner') tags = {
        owner: 'OWNER'
    }
    if (teks == 'rpg') tags = {
        rpg: 'RPG'
    }
    if (teks == 'info') tags = {
        info: 'INFO'
    }
    if (teks == 'sticker') tags = {
        sticker: 'STICKER'
    }
    if (teks == 'tools') tags = {
        tools: 'TOOLS'
    }
    if (teks == 'anime') tags = {
        anime: 'ANIME'
    }
    try {
        let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
        let {
            registered
        } = global.db.data.users[m.sender]
        let user = global.db.data.users[m.sender];
        let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        // d.getTimeZoneOffset()
        // Offset -420 is 18.00
        // Offset    0 is  0.00
        // Offset  420 is  7.00
        let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
        let week = d.toLocaleDateString(locale, {
            weekday: 'long'
        })
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d)
        let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })
        let waktu = moment.tz('Asia/Jakarta').format('HH:mm');
        let _uptime = process.uptime() * 1000
        let _muptime
        if (process.send) {
            process.send('uptime')
            _muptime = await new Promise(resolve => {
                process.once('message', resolve)
                setTimeout(resolve, 1000)
            }) * 1000
        }
        let muptime = clockString(_muptime)
        let uptime = clockString(_uptime)
        let ucap = ucapan()
        let module = package.module
        let totalreg = Object.keys(global.db.data.users).length
        let fkontak = {
            "key": {
                "participants": "0@s.whatsapp.net",
                "remoteJid": "status@broadcast",
                "fromMe": false,
                "id": "Powered by : Asyl"
            },
            "message": {
                "contactMessage": {
                    "vcard": `BEGIN:VCARD\nVERSION:1.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            },
            "participant": "0@s.whatsapp.net"
        };
        let payment = {
            "key": {
                "remoteJid": "0@s.whatsapp.net",
                "fromMe": false
            },
            "message": {
                "requestPaymentMessage": {
                    "currencyCodeIso4217": "USD",
                    "amount1000": "99999999999",
                    "requestFrom": "0@s.whatsapp.net",
                    "noteMessage": {
                        "extendedTextMessage": {
                            "text": `${name}-san 🐼`,
                            "contextInfo": {
                                "mentionedJid": [`${m.sender}`]
                            }
                        }
                    },
                    "expiryTimestamp": "0",
                    "amount": {
                        "value": "99999999999",
                        "offset": 1000,
                        "currencyCode": "USD"
                    }
                }
            }
        }
        let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
        let group = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])
        let isPremium = user.premium ? "Premium" : "Free User"
        let lim = user.premium ? '∞' : user.limit;
        let ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://telegra.ph/file/1dff1788814dd281170f8.jpg");
        let tum = await getBuffer(ppUrl)
        let today = new Date();
        let tanggal = today.toLocaleDateString("id-ID", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let day = today.toLocaleDateString("id-ID", {
            weekday: "long"
        });
        let more = String.fromCharCode(8206)
        let readMore = more.repeat(4001)
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            }
        })
        if (teks == '404') {
            let capt = `Hello, @${m.sender.replace(/@.+/g, '')} 🪸\n`
            capt += `I am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.\n\n`

            capt += ` –   *BOT INFORMATION*\n`
            capt += `┌  ◦ Database : Mongodb\n`
            capt += `│  ◦ Library : Baileys\n`
            capt += `└  ◦ Author : ${global.namebot}\n\n`
            capt += ` –   *BOT LIST MENU*\n`
            capt += `┌  ◦  ${_p + command} main\n`
            capt += `│  ◦  ${_p + command} info\n`
            capt += `│  ◦  ${_p + command} downloader\n`
            capt += `│  ◦  ${_p + command} ai\n`
            capt += `│  ◦  ${_p + command} premium\n`
            capt += `│  ◦  ${_p + command} game\n`
            capt += `│  ◦  ${_p + command} fun\n`
            capt += `│  ◦  ${_p + command} music\n`
            capt += `│  ◦  ${_p + command} group\n`
            capt += `│  ◦  ${_p + command} internet\n`
            capt += `│  ◦  ${_p + command} owner\n`
            capt += `│  ◦  ${_p + command} rpg\n`
            capt += `│  ◦  ${_p + command} maker\n`
            capt += `│  ◦  ${_p + command} sticker\n`
            capt += `│  ◦  ${_p + command} tools\n`
            capt += `│  ◦  ${_p + command} anime\n`
            capt += `│  ◦  ${_p + command} quotes\n`
            capt += `└  ◦  ${_p + command} convert\n`
            capt += `Asyl Botz Made By Asyl`
            conn.menubot = conn.menubot ? conn.menubot : {
                id: 1
            }
            if (conn.menubot.id === 1) {
                let tekss = ` –   *BOT INFORMATION*\n`
                tekss += '┌  ◦ Name Bot:' + ` Asyl-Botz\n`
                tekss += '│  ◦ Uptime:' + ` ${uptime}\n`
                tekss += '│  ◦ Date:' + ` ${tanggal}\n`
                tekss += '│  ◦ Pengguna:' + ` ${totalreg} Users\n`
                tekss += '│  ◦ Groups:' + ` ${group.length} Groups\n`
                tekss += '└  ◦ Memory:' + ` ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}\n\n`
                tekss += ` –   *USER INFORMATION*\n`
                tekss += '┌  ◦ Name:' + ` ${name}\n`
                tekss += '│  ◦ Limit:' + ` ${lim}\n`
                tekss += '└  ◦ Status:' + ` ${isPremium}\n`
                let sections = [{
                        title: 'List menu',
                        highlight_label: 'Populer Plugins',
                        rows: [{
                                title: 'Download Feature',
                                description: `Displays menu Download ( List Menu )`,
                                id: '.menu downloader'
                            },
                            {
                                title: 'Main Feature',
                                description: "Displays menu Main ( List Menu )",
                                id: '.menu main'
                            },
                            {
                                title: 'Ai Feature',
                                description: "Displays menu Ai ( List Menu )",
                                id: '.menu ai'
                            },
                            {
                                title: 'Game Feature',
                                description: "Displays menu Game ( List Menu )",
                                id: '.menu game'
                            },
                            {
                                title: 'Rpg Feature',
                                description: "Displays menu Rpg ( List Menu )",
                                id: '.menu rpg'
                            },
                            {
                                title: 'Info Feature',
                                description: "Displays menu Info ( List Menu )",
                                id: '.menu info'
                            },
                            {
                                title: 'Premium Feature',
                                description: "Displays menu Premium ( List Menu )",
                                id: '.menu premium'
                            },
                            {
                                title: 'Group Feature',
                                description: "Displays menu Group ( List Menu )",
                                id: '.menu group'
                            },
                            {
                                title: 'Internet Feature',
                                description: "Displays menu Internet ( List Menu )",
                                id: '.menu internet'
                            },
                            {
                                title: 'Fun Feature',
                                description: "Displays menu Fun ( List Menu )",
                                id: '.menu fun'
                            },
                            {
                                title: 'Owner Feature',
                                description: "Displays menu Owner ( List Menu )",
                                id: '.menu owner'
                            },
                            {
                                title: 'Maker Feature',
                                description: "Displays menu Maker ( List Menu )",
                                id: '.menu maker'
                            },
                            {
                                title: 'Sticker Feature',
                                description: "Displays menu Sticker ( List Menu )",
                                id: '.menu sticker'
                            },
                            {
                                title: 'Tools Feature',
                                description: "Displays menu Tools ( List Menu )",
                                id: '.menu tools'
                            },
                            {
                                title: 'Anime Feature',
                                description: "Displays menu Anime ( List Menu )",
                                id: '.menu anime'
                            },
                            {
                                title: 'Quotes Feature',
                                description: "Displays menu Quotes ( List Menu )",
                                id: '.menu quotes'
                            },
                            {
                                title: 'Convert Feature',
                                description: "Displays menu Convert ( List Menu )",
                                id: '.menu convert'
                            },
                            {
                                title: 'Music Feature',
                                description: "Displays menu Music ( List Menu )",
                                id: '.menu music'
                            }
                        ]
                    },
                    {
                        title: 'System Information',
                        highlight_label: 'Populer Plugins',
                        rows: [{
                                title: 'Creator Bot',
                                description: `Bot owner info, who created it ( information )`,
                                id: '.owner'
                            },
                            {
                                title: 'Info System',
                                description: "Viewing System Info on Bot ( information )",
                                id: '.ping'
                            },
                            {
                                title: 'Info Menu',
                                description: "Viewing menulist on Bot ( information )",
                                id: '.list'
                            },
                            {
                                title: 'Script Info',
                                description: "Source Code Bot WhatsApp Info ( information )",
                                id: '.sc'
                            },
                            {
                                title: 'Donate Info',
                                description: "Donate to Support Bot ( information )",
                                id: '.donate'
                            }
                        ]
                    }
                ]

                let listMessage = {
                    title: 'List Menu',
                    sections
                };
                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            "messageContextInfo": {
                                "deviceListMetadata": {},
                                "deviceListMetadataVersion": 2
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
                                        body: 'Version: 1.0.2-beta',
                                        thumbnailUrl: 'https://files.catbox.moe/sqtgqg.jpg',
                                        sourceUrl: 'https://alfisyl.my.id',
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    },
                                },
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: tekss
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'Click the button below for the menu list'
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: `Hello, @${m.sender.replace(/@.+/g, '')} 🪸 I am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.`,
                                    subtitle: "Asyl",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia({
                                        document: {
                                            url: 'https://wa.me/'
                                        },
                                        mimetype: 'image/png',
                                        fileName: ` ${ucap} ${name}`,
                                        jpegThumbnail: await conn.resize(ppUrl, 400, 400),
                                        fileLength: 0
                                    }, {
                                        upload: conn.waUploadToServer
                                    }))
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                            "name": "single_select",
                                            "buttonParamsJson": JSON.stringify(listMessage)
                                        },
                                        {
                                            "name": "cta_url",
                                            "buttonParamsJson": "{\"display_text\":\"Owner\",\"url\":\"https://wa.me/62895322391225\",\"merchant_url\":\"https://wa.me/62895322391225\"}"
                                        },
                                    ],
                                })
                            })
                        }
                    }
                }, {
                    userJid: m.chat,
                    quoted: fkontak
                })
                conn.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                })
            } else if (conn.menubot.id === 2) {
                await conn.reply(m.chat,
                    capt,
                    m)
            } else if (conn.menubot.id === 3) {
                await conn.sendMessage(m.chat, {
                    text: Styles(capt),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            showAdAttribution: true,
                            title: namebot,
                            thumbnailUrl: ppUrl,
                            sourceUrl: 'https://alfisyl.my.id',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                })
            } else if (conn.menubot.id === 4) {
                let call = {
                    scheduledCallCreationMessage: {
                        callType: 2,
                        scheduledTimestampMs: Date.now(),
                        title: capt
                    }
                }
                await conn.relayMessage(m.chat, call, {})
            } else if (conn.menubot.id === 5) {
                await conn.relayMessage(m.chat, {
                    requestPaymentMessage: {
                        currencyCodeIso4217: 'INR',
                        amount1000: fsizedoc,
                        requestFrom: '0@s.whatsapp.net',
                        noteMessage: {
                            extendedTextMessage: {
                                text: capt,
                                contextInfo: {
                                    mentionedJid: [m.sender],
                                    externalAdReply: {
                                        showAdAttribution: true
                                    }
                                }
                            }
                        }
                    }
                }, {});
            } else if (conn.menubot.id === 6) {
                await conn.sendMessage(m.chat, {
                    video: {
                        url: 'https://telegra.ph/file/189063186f8e8478f1f05.mp4'
                    },
                    caption: capt,
                    gifPlayback: true,
                    gifAttribution: 1,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                }, {
                    quoted: m
                })
            }
            return
        }
        let groups = {}
        for (let tag in tags) {
            groups[tag] = []
            for (let plugin of help)
                if (plugin.tags && plugin.tags.includes(tag))
                    if (plugin.help) groups[tag].push(plugin)
        }
        conn.menu = conn.menu ? conn.menu : {}
        let before = conn.menu.before || defaultMenu.before
        let header = conn.menu.header || defaultMenu.header
        let body = conn.menu.body || defaultMenu.body
        let footer = conn.menu.footer || defaultMenu.footer
        let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
        let _text = [
            before,
            ...Object.keys(tags).map(tag => {
                return header.replace(/%category/g, tags[tag]) + '\n' + [
                    ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                        return menu.help.map(help => {
                            return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                                .trim()
                        }).join('\n')
                    }),
                    footer
                ].join('\n')
            }),
            after
        ].join('\n')
        text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
        let replace = {
            '%': '%',
            p: _p,
            uptime,
            muptime,
            me: conn.user.name,
            npmname: package.name,
            npmdesc: package.description,
            version: package.version,
            github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
            name,
            weton,
            week,
            date,
            dateIslamic,
            time,
            module,
            totalreg,
            rtotalreg
        }
        text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
        await conn.reply(m.chat, Styles(text).trim(), m)
    } catch (e) {
        conn.reply(m.chat, 'ketik *.allmenu* je la', m)
        throw e
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help)$/i

handler.register = false;
handler.limit = true;
handler.register = true

module.exports = handler;

async function getBuffer(url, options) {
    try {
        options ? options : {}
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (err) {
        return err
    }
}

function toRupiah(angka) {
    var saldo = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
    return '' + saldo.split('', saldo.length - 1).reverse().join('');
}

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH');
    let res = "Malam";
    if (time >= 4) {
        res = "Pagi";
    }
    if (time > 10) {
        res = "Siang";
    }
    if (time >= 15) {
        res = "Sore";
    }
    if (time >= 18) {
        res = "Malam";
    }
    return res;
}