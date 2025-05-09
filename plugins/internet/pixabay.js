module.exports = {
  help: ["pixabay"].map((a) => a + " *[type query]*"),
  tags: ["internet"],
  command: ["pixabay"],
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
    if (!text)
      throw `*• Example :* ${usedPrefix + command} *[type query]*
 
List Type :
* *Image*
* *Video*`;
    let keyword = text.split(" ")[0];
    let data = text.slice(keyword.length + 1);
    if (keyword.toLowerCase() === "image") {
      if (!data) throw `*• Example :* ${usedPrefix + command} *[query]*`;
      let res = await Func.fetchJson(
        "https://pixabay.com/api/?key=30089426-4575ed7bbbc8bfffe9a0b8eb4&q=" +
          data,
      );
      let rand = await Func.random(res.hits);
      let cap = `*± P I X - A B A Y*
* *Type :* ${rand.type}
* *Tags :* ${rand.tags}
* *Size :* ${rand.imageWidth} x ${rand.imageHeight}
* *Views :* ${Func.formatNumber(rand.views)}
* *Likes :* ${Func.formatNumber(rand.likes)}
* *Comments :* ${Func.formatNumber(rand.comments)}
* *Downloads :* ${Func.formatNumber(rand.downloads)}
* *Username :* ${rand.user} *[ ${rand.user_id} ]*

_Media Has been sent, Please wait...._`;
      let q = await conn.sendMessage(
        m.chat,
        {
          text: cap,
        },
        {
          quoted: fkontak,
        },
      );
      await conn.sendMessage(
        m.chat,
        {
          image: {
            url: rand.largeImageURL,
          },
        },
        {
          quoted: q,
        },
      );
    } else if (keyword.toLowerCase() === "video") {
      if (!data) throw `*• Example :* ${usedPrefix + command} *[query]*`;
      let res = await Func.fetchJson(
        "https://pixabay.com/api/videos?key=30089426-4575ed7bbbc8bfffe9a0b8eb4&q=" +
          data,
      );
      let rand = await Func.random(res.hits);
      let cap = `*± P I X - A B A Y*
* *Type :* ${rand.type}
* *Tags :* ${rand.tags}
* *Duration :* ${rand.duration} seconds
* *Views :* ${Func.formatNumber(rand.views)}
* *Likes :* ${Func.formatNumber(rand.likes)}
* *Comments :* ${Func.formatNumber(rand.comments)}
* *Downloads :* ${Func.formatNumber(rand.downloads)}
* *Username :* ${rand.user} *[ ${rand.user_id} ]*

_Media Has been sent, Please wait...._`;
      let q = await conn.sendMessage(
        m.chat,
        {
          image: {
            url: rand.videos["medium"].thumbnail,
          },
          caption: cap,
        },
        {
          quoted: fkontak,
        },
      );
      await conn.sendMessage(
        m.chat,
        {
          video: {
            url: rand.videos["medium"].url,
          },
          gifPlayBack: true,
        },
        {
          quoted: q,
        },
      );
    } else return;
  },
};
