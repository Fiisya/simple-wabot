//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/npms


const fetch = require('node-fetch');

let handler = async (m, {
    text
}) => {
    if (!text) return m.reply("contoh.npms bochilteam")
    let res = await fetch(`http://registry.npmjs.com/-/v1/search?text=${text}`)
    let {
        objects
    } = await res.json()
    if (!objects.length) throw `Query "${text}" not found :/`
    let txt = objects.map(({
        package: pkg
    }) => {
        return `*${pkg.name}* v${pkg.version}
* *Description:* ${pkg.description}
* *Homepage:* ${pkg.links.homepage}
* *Bugs:* ${pkg.links.bugs}
* *Npm:* ${pkg.links.npm}
---
* *Email Owner:* ${pkg.publisher.email}
* *Username:* ${pkg.publisher.username}`
    }).join`\n\n`
    m.reply(txt)
}
handler.help = ['npmsearch']
handler.tags = ['internet']
handler.command = /^npm(js|search)?$/i

module.exports = handler