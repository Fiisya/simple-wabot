async function ttSearch(query) {
  return new Promise(async (resolve, reject) => {
    axios("https://tikwm.com/api/feed/search", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: "current_language=en",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      data: {
        keywords: query,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
      method: "POST",
    }).then((res) => {
      resolve(res.data.data);
    });
  });
}  

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*• Example :* ${usedPrefix + command} *[query]*`;
  let [keyword, data] = text.split("•");
  try {
    if (keyword === "videos") {
      if (!data) return;
      let url = "https://tikwm.com" + data;
      m.reply(done, url);
    } else if (keyword === "audios") {
      if (!data) return;
      let url = "https://tikwm.com" + data;
      m.reply(done, url);
    } else {
      let search = await (await ttSearch(text)).videos;
      conn.sendList(
        m.chat,
        "Click Here ",
        search.map((i, a) => {
          return {
            headers: `${a + 1} ${i.title}`,
            rows: [
              {
                headers: `Download videos`,
                title: "• Region : " + i.region,
                body: "• Author : " + i.author.nickname,
                description: "Get Video TikTok",
                command: usedPrefix + command + " videos•" + i.play,
              },
              {
                headers: `Download Music`,
                title: "• Name music : " + i.music_info.title,
                body: "• Author : " + i.music_info.author,
                description: "Get Music TikTok",
                command: usedPrefix + command + " audios•" + i.music,
              },
            ],
          };
        }),
        m,
        {
          body: `*• Total Videos :* ${search.length}\n*• Result from :* ${text}`,
          footer: "*® FRESS BUTTON FOR DOWNLOAD RESULT*",
          url: "https://tikwm.com" + search[0].cover,
        },
      );
    }
  } catch (e) {
    throw eror;
  }
};
handler.help = ["ttsearch"].map((a) => a + " *[query]*");
handler.tags = ["downloader"];
handler.command = ["tiktoks", "ttsearch"];

module.exports = handler;
