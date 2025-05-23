//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : allmenu


const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require('baileys')
process.env.TZ = 'Asia/Jakarta'
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')

let tags = {
    'main': 'MENU UTAMA',
    'downloader': 'MENU DOWNLOADER',
    'sticker': 'MENU CONVERT',
    'fun': 'MENU FUN',
    'game': 'MENU GAME',
    'group': 'MENU GROUP',
    'info': 'MENU INFO',
    'internet': 'MENU INTERNET',
    'maker': 'MENU MAKER',
    'owner': 'MENU OWNER',
    'quotes': 'MENU QUOTES',
    'ai': 'MENU AI',
    'saluran': 'MENU SALURAN',
    'music': 'MENU MUSIC',
    'premium': 'MENU PREMIUM',
    'tools': 'MENU TOOLS',
    'rpg': 'MENU RPG',
    '': 'NO CATEGORY',
}
const defaultMenu = {
    before: `
Hi %name
I am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.

 ◦  *Library:* Baileys
 ◦  *Function:* Assistant
 
┌  ◦ Uptime : %uptime
│  ◦ Hari : %week %weton
│  ◦ Waktu : %time
│  ◦ Tanggal : %date
│  ◦ Version : %version
└  ◦ Prefix Used : *[ %p ]*
`.trimStart(),
    header: '┌  ◦ *%category*',
    body: '│  ◦ %cmd %islimit %isPremium',
    footer: '└  ',
    after: ``,
}
let handler = async (m, {
    conn,
    usedPrefix: _p
}) => {
    try {
        let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
        let {
            limit
        } = global.db.data.users[m.sender]
        let name = `@${m.sender.split`@`[0]}`
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
        const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
        const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
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
        let totalreg = Object.keys(global.db.data.users).length
        let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            }
        })
        for (let plugin of help)
            if (plugin && 'tags' in plugin)
                for (let tag of plugin.tags)
                    if (!(tag in tags) && tag) tags[tag] = tag
        conn.menu = conn.menu ? conn.menu : {}
        let before = conn.menu.before || defaultMenu.before
        let header = conn.menu.header || defaultMenu.header
        let body = conn.menu.body || defaultMenu.body
        let footer = conn.menu.footer || defaultMenu.footer
        let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
        let _text = [
            before,
            ...Object.keys(tags).map(tag => {
                return header.replace(/%category/g, tags[tag]) + '\n' + [
                    ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                        return menu.help.map(help => {
                            return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                                .replace(/%islimit/g, menu.limit ? '' : '')
                                .replace(/%isPremium/g, menu.premium ? '' : '')
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
            me: conn.getName(conn.user.jid),
            npmname: package.name,
            npmdesc: package.description,
            version: package.version,
            github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
            limit,
            name,
            weton,
            week,
            date,
            dateIslamic,
            wib,
            wit,
            wita,
            time,
            totalreg,
            rtotalreg
        }
        text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
        let media = await prepareWAMessageMedia({
            image: {
                url: 'https://raw.githubusercontent.com/Fiisya/uploads/main/uploads/1747336545556.jpeg'
            }
        }, {
            upload: conn.waUploadToServer
        });
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: text
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: ""
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            ...media,
                            title: "",
                            subtitle: "",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: "Instagram",
                                    url: 'https://instagram.com/alfisyahriaal',
                                    merchant_url: 'https://instagram.com/alfisyahriaal'
                                })
                            }, ],
                        })
                    })
                }
            }
        }, {})
        return await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    } catch (e) {
        conn.reply(m.chat, 'Maaf, menu sedang error', m)
        throw e
    }
}
handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^(allmenu)$/i

handler.exp = 3

module.exports = handler


function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}