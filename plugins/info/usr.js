//© AkiraaBot 2023-2024
// • Credits : wa.me/6287869975929 [ Bang syaii ]
// • Owner: 6283831945469,6287869975929

/*
• untuk siapa pun yang ketahuan menjual script ini tanpa sepengetahuan developer mohon untuk dilaporkan !
*/

let handler = async (m) => {
  let totalreg = Object.keys(global.db.data.users).length;
  let rtotalreg = Object.values(global.db.data.users).filter(
    (user) => user.registered == true,
  ).length;
  m.reply(`• Total User Today : *[ ${rtotalreg}/${totalreg} ]*`);
};
handler.help = ["usr"].map((a) => a + " *[check total user]*");
handler.tags = ["info"];
handler.command = ["usr"];

module.exports = handler;
