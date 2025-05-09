const yts = require("yt-search");

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*• Example :* ${usedPrefix + command} *[query]*`;
    m.reply('Please wait...');
    try {
let q = await(await yts(text)).videos
let array = []
for (let i of q) {
array.push({
headers: "YOUTUBE SEARCH",
rows: [{
   headers: "Download Video",
   title: i.title,
   body: i.description,
  command: ".ytmp4 " + i.url
   },{
   headers: "Download Audio",
   title: i.title,
   body: i.description,
  command: ".ytmp3 " + i.url
   }]
})
}
            conn.sendList(m.chat, `Find Result [${q.length}]`, array, m, {
body :q.map((a, i) => `*• ${i + 1}.* ${a.title.toUpperCase()}
*• Duration :* ${a.timestamp}
*• Release :* ${a.ago}
*• Author :* ${a.author.name}
*• Url :* ${a.url}`).join("\n\n"), footer: "\n[ ! ] CLICK BUTTON TO VIEW RESULT", url: q[0].thumbnail });
    } catch(e) {
        throw e;
    }
}
handler.help = ["ytsearch"].map(a => a + " *[query]*");
handler.tags = ["downloader"];
handler.command = ["yts", "ytsearch"];

module.exports = handler;