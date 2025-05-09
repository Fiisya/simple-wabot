let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.xnxx = conn.xnxx ? conn.xnxx : {};
  if (!text) throw `•  *Example :* ${usedPrefix + command} genshin impact`;
  const video = await Scraper.Tools.xnxx.search(text);
  const hasil = `*[ XNXX SEARCH ]*\n${video.result.map((a, index) => `*${index + 1}* *Title:* ${a.title}\n*• Source:* ${a.link}\n*• Info:* ${a.info}`).join("\n\n")}`;
  const key = await conn.reply(m.chat, hasil, m);
  await conn.reply(
    m.chat,
    `Type one of the numbers *1 - ${video.result.length}* to download the video`,
    key,
  );
  conn.xnxx[m.sender] = video.result;
};

handler.before = async (m, { conn }) => {
  conn.xnxx = conn.xnxx ? conn.xnxx : {};
  if (!m.text) return;
  if (isNaN(m.text)) return;
  if (!conn.xnxx[m.sender]) return;
  const video = conn.xnxx[m.sender][m.text - 1].link;
  const hasil = await Scraper.Tools.xnxx.download(video);
  conn.sendFile(m.chat, hasil.files.low, null, done, m);
  delete conn.xnxx[m.sender];
};

handler.help = ["xnxx"].map((a) => a + " *[premium only]*");
handler.tags = ["premium"];
handler.command = ["xnxx"];
handler.premium = true;

module.exports = handler;
