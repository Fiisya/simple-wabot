//© AkiraaBot 2023-2024
// • Credits : wa.me/6287869975929 [ Bang syaii ]
// • Owner: 6287869975929,6283831945469

/*
• untuk siapa pun yang ketahuan menjual script ini tanpa sepengetahuan developer mohon untuk dilaporkan !
*/

module.exports = {
  help: ["ssweb"].map((a) => a + " *[url]*"),
  tags: ["tools"],
  command: ["ssweb"],
  code: async (
    m,
    {
      conn,
      usedPrefix,
      command,
      text,
      isOwner,
      isAdmin,
      isBotAdmin,
      isPrems,
      chatUpdate,
    },
  ) => {
    if (!text) throw `*• Example :* ${usedPrefix + command} *[url]*`;
    m.reply(wait);
    let url = Func.isUrl(text);
    if (url) {
    for (let i of url) {
      conn.sendMessage(m.chat, {
        image: {
          url: `https://api.mightyshare.io/v1/19EIFDUEL496RA3F/jpg?url=${Func.isUrl(i) ? i : `https://${i}`}`,
        },
        caption: done,
      });
    }
  } else {
      conn.sendMessage(m.chat, {
        image: {
          url: `https://api.mightyshare.io/v1/19EIFDUEL496RA3F/jpg?url=https://${text}`,
        },
        caption: done,
      })
    }
  },
};
