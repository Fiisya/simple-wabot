let fetch = require('node-fetch')
let {
    JSDOM
} = require('jsdom')
let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply("*Example:* .font Hallo word");
    conn.reply(m.chat, Object.entries(await stylizeText(text)).map(([name, value]) => `*${name}*\n${value}`).join`\n\n`, m)
}
handler.help = ['styletext'].map(v => v + ' *<text>*')
handler.tags = ['tools']
handler.command = /^(font|styletext)$/i
module.exports = handler

async function stylizeText(text) {
    let res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
    let html = await res.text()
    let dom = new JSDOM(html)
    let table = dom.window.document.querySelector('table').children[0].children
    let obj = {}
    for (let tr of table) {
        let name = tr.querySelector('.aname').innerHTML
        let content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
        obj[name + (obj[name] ? ' Reversed' : '')] = content
    }
    return obj
}