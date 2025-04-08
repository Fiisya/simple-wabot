module.exports = {
  help: ["tiktostalk"],
  tags: ["downloader"],
  command: ["tiktostalk", "tiktok_stalk"],
  code: async (
    m,
    {
      conn,
      usedPrefix,
      command,
      args,
      text,
      isOwner,
      isAdmin,
      isBotAdmin,
      isPrems,
      chatUpdate,
    },
  ) => {
    if (!text) throw `*• Example :* ${usedPrefix + command} *[username]*`;
    m.reply(wait);
    var result = await tiktokStalk(text.split(" ").join(""));
    result = result.user;
    let cap = `*[ TIKTOK - STALK ]*
*• Nickname :* ${result.nickname}
*• Id :* ${result.id}
*• Region :* ${result.region}
*• Url :* https://tiktok.com/@${result.uniqueId}`;
    conn.sendMessage(
      m.chat,
      { image: { url: result.avatarThumb }, caption: cap },
      { quoted: m },
    );
  },
};

async function tiktokStalk(user) {
  try {
    const url = await fetch(`https://tiktok.com/@${user}`, {
      headers: {
        "User-Agent": "PostmanRuntime/7.32.2",
      },
    });
    const html = await url.text();
    const $ = cheerio.load(html);
    const data = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__").text();
    const result = JSON.parse(data);
    if (result["__DEFAULT_SCOPE__"]["webapp.user-detail"].statusCode !== 0) {
      const ress = {
        status: "error",
        message: "User not found!",
      };
      console.log(ress);
      return ress;
    }
    const res = result["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"];
    return res;
  } catch (err) {
    console.log(err);
    return String(err);
  }
}
