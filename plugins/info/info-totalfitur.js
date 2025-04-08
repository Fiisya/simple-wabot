//© AkiraaBot 2023-2024
// • Credits : wa.me/6287869975929 [ Bang syaii ]
// • Owner: 6283831945469,6287869975929

/*
• untuk siapa pun yang ketahuan menjual script ini tanpa sepengetahuan developer mohon untuk dilaporkan !
*/

let fs = require("fs");
let handler = async (m, { conn, args, command }) => {
  let fitur = Object.values(plugins)
    .filter((v) => v.help && !v.disabled)
    .map((v) => v.help)
    .flat(1);
  let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags,
  ).length;
  let hasil = fitur.length;
  conn.sendButton(m.chat, [["👥 INFO - SCRIPT", ".sc"]], m, {
    body: `*+ T O T A L - F E A T U R E S*

*• Total Files :* ${Object.keys(plugins).length}
*• Total Command :* ${fitur.length}
`,
    footer: "Request features chat my *.owner*",
  });
};
handler.help = ["totalfitur"].map((a) => a + " *[get total features]*");
handler.tags = ["info"];
handler.command = ["totalfitur"];
module.exports = handler;
