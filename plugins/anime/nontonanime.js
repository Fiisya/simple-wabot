const axios = require("axios");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const base = {
  latest: "https://nontonanime.live/",
  orderAnime: "https://nontonanime.live/anime/?status&type&order",
  search: "https://nontonanime.live/?s="
};

const nontonAnime = {
  latest: async () => {
    const { data } = await axios.get(base.latest);
    const $ = cheerio.load(data);
    const animeList = [];

    $(".listupd.normal .bsx a").each((_, element) => {
      animeList.push({
        title: $(element).attr("title"),
        url: $(element).attr("href"),
        episode: $(element).find(".bt .epx").text().trim(),
        type: $(element).find(".limit .typez").text().trim(),
        thumbnail: $(element).find(".lazyload").attr("data-src") || $(element).find("img").attr("src"),
      });
    });

    return animeList;
  },

  upcoming: async () => {
    const { data } = await axios.get(base.orderAnime);
    const $ = cheerio.load(data);
    const upcomingList = [];

    $(".listupd .bsx a").each((_, element) => {
      const episode = $(element).find(".bt .epx").text().trim();

      if (episode.toLowerCase() === "upcoming") {
        upcomingList.push({
          title: $(element).attr("title"),
          url: $(element).attr("href"),
          episode,
          type: $(element).find(".limit .typez").text().trim(),
          thumbnail: $(element).find(".lazyload").attr("data-src") || $(element).find("img").attr("src"),
        });
      }
    });

    return upcomingList;
  },

  search: async (q) => {
    const { data } = await axios.get(base.search + encodeURIComponent(q));
    const $ = cheerio.load(data);
    const searchResults = [];

    $(".bsx a").each((_, element) => {
      searchResults.push({
        title: $(element).attr("title"),
        url: $(element).attr("href"),
        episode: $(element).find(".bt .epx").text().trim(),
        type: $(element).find(".limit .typez").text().trim(),
        thumbnail: $(element).find(".lazyload").attr("data-src") || $(element).find("img").attr("src"),
      });
    });

    return searchResults;
  },

  details: async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("h1.entry-title").text().trim();
    const thumbnail = $(".bigcover .lazyload").attr("data-src") || $(".bigcover img").attr("src");
    const synopsis = $(".entry-content p").text().trim();
    const status = $(".info-content .spe span:contains('Status')").text().replace("Status:", "").trim();
    const studio = $(".info-content .spe span:contains('Studio') a").text().trim();
    const season = $(".info-content .spe span:contains('Season') a").text().trim();
    const type = $(".info-content .spe span:contains('Type')").text().replace("Type:", "").trim();

    const genres = $(".genxed a").map((_, el) => $(el).text().trim()).get();

    const characters = $(".cvlist .cvitem").map((_, el) => {
      const charName = $(el).find(".cvchar .charname").text().trim();
      const voiceActor = $(el).find(".cvactor .charname a").text().trim();
      return { charName, voiceActor };
    }).get();

    const episodes = $(".eplister ul li").map((_, el) => {
      const episodeKe = $(el).find(".epl-num").text().trim();
      const title = $(el).find(".epl-title").text().trim();
      const dateOfRelease = $(el).find(".epl-date").text().trim();
      const link = $(el).find("a").attr("href");
      return { episodeKe, title, dateOfRelease, link };
    }).get();

    return {
      title,
      thumbnail,
      synopsis,
      status,
      studio,
      season,
      type,
      genres,
      characters,
      episodes
    };
  },

  download: async (urlEpisodes) => {
    const { data } = await axios.get(urlEpisodes);
    const $ = cheerio.load(data);
    const downloadLinks = [];

    $(".mirror option").each((_, element) => {
      const encodedValue = $(element).attr("value");
      if (encodedValue) {
        const buffer = Buffer.from(encodedValue, "base64");
        const decodedLink = buffer.toString("utf-8");

        downloadLinks.push({
          server: $(element).text().trim(),
          link: decodedLink.includes("<iframe")
            ? cheerio.load(decodedLink)("iframe").attr("src")
            : decodedLink
        });
      }
    });

    return downloadLinks;
  }
};

// Handler utama
const handler = async (m, { text, args, conn, command }) => {
  if (command === 'latestanime') {
    const list = await nontonAnime.latest();
    if (!list.length) throw 'Tidak ada data ditemukan.';
    const result = list.slice(0, 5).map((a, i) =>
      `*${i + 1}. ${a.title}*\nEpisode: ${a.episode}\nType: ${a.type}\nURL: ${a.url}`
    ).join('\n\n');
    m.reply(result);
  }

  if (command === 'upcominganime') {
    const list = await nontonAnime.upcoming();
    if (!list.length) throw 'Tidak ada data upcoming.';
    const result = list.slice(0, 5).map((a, i) =>
      `*${i + 1}. ${a.title}*\nEpisode: ${a.episode}\nType: ${a.type}\nURL: ${a.url}`
    ).join('\n\n');
    m.reply(result);
  }

  if (command === 'searchanime') {
    if (!text) throw `Contoh: .${command} jujutsu kaisen`;
    const list = await nontonAnime.search(text);
    if (!list.length) throw 'Anime tidak ditemukan.';
    const result = list.slice(0, 5).map((a, i) =>
      `*${i + 1}. ${a.title}*\nEpisode: ${a.episode}\nType: ${a.type}\nURL: ${a.url}`
    ).join('\n\n');
    m.reply(result);
  }

  if (command === 'animeinfo') {
    if (!text || !text.startsWith('http')) throw `Contoh: .${command} https://nontonanime.live/naruto/`;
    const data = await nontonAnime.details(text);
    if (!data) throw 'Gagal mengambil detail anime.';
    const {
      title, synopsis, status, studio, season, type,
      genres, characters, episodes, thumbnail
    } = data;

    let info = `*${title}*\n\n`;
    info += `*Status:* ${status}\n`;
    info += `*Studio:* ${studio}\n`;
    info += `*Season:* ${season}\n`;
    info += `*Type:* ${type}\n`;
    info += `*Genres:* ${genres.join(', ')}\n\n`;
    info += `*Sinopsis:*\n${synopsis.substring(0, 500)}...\n\n`;
    info += `*Total Episode:* ${episodes.length}\n`;

    await conn.sendFile(m.chat, thumbnail, 'anime.jpg', info, m);
  }

  if (command === 'downloadanime') {
    if (!text || !text.startsWith('http')) throw `Contoh: .${command} https://nontonanime.live/boruto-episode-1-sub-indo/`;
    const links = await nontonAnime.download(text);
    if (!links.length) throw 'Tidak ada link download ditemukan.';
    const list = links.map((v, i) => `*${i + 1}. ${v.server}*\n${v.link}`).join('\n\n');
    m.reply(`*Link Download:*\n\n${list}`);
  }
};

handler.help = ['latestanime', 'upcominganime', 'searchanime <judul>', 'animeinfo <url>', 'downloadanime <url_episode>'];
handler.tags = ['anime'];
handler.command = /^latestanime|upcominganime|searchanime|animeinfo|downloadanime$/i;

module.exports = handler;
