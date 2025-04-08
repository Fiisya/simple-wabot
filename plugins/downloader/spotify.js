let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*• Example :* ${usedPrefix + command} *[url/query]*`;
  if (Func.isUrl(text)) {
    let detail = await Scraper["Tools"].SpotifyApi.detail(text);
    let { download } = await Scraper["Tools"].SpotifyApi.download(text);
    let caption = `*[ SPOTIFY PLAY ]*\n*• Title:* ${detail.title}\n*• Artist:* ${detail.artist.href} *[ ${detail.artist.name}]*\n*• Duration:* ${await detail.duration} \n\n*Audio has been sent...*`;
    let qkey = await conn.sendMessage(
      m.chat,
      {
        image: {
          url: detail.thumbnail,
        },
        caption: caption,
      },
      { quoted: m },
    );

    await conn.sendMessage(
      m.chat,
      {
        audio: {
          url: download,
        },
        mimetype: "audio/mpeg",
      },
      { quoted: qkey },
    );
  } else {
    let search = await Scraper["Tools"].SpotifyApi.search(text);
    await m.reply(
      "*[ SPOTIFY SEARCH ]*\n\n" +
        search.data.map(
          (a, index) =>
            `\n=========================\n*${index + 1}.* ${a.title.toUpperCase()}\n*• duration:* ${a.duration}\n*• Popularity:* ${a.popularity}\n*• Song Preview:* ${a.preview}\n*• Url:* ${a.url}\ n=========================\n`,
        ),
    );
  }
};
handler.help = ["spotify"].map((a) => a + " *[search/url]*");
handler.tags = ["downloader"];
handler.command = ["spotify"];

module.exports = handler;
