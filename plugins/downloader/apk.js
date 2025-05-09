const fetch = require('node-fetch');

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `*• Example :* ${usedPrefix + command} *[url/query]*`;
       try {
        let apiUrl = `https://bk9.fun/download/apk?id=${encodeURIComponent(text)}`;
          let response = await fetch(apiUrl);
          let data = await response.json();
          let apkData = data.BK9;
          await conn.sendMessage(
            m.chat,
            {
              document: { url: apkData.dllink },
              mimetype: 'application/vnd.android.package-archive',
              fileName: apkData.name + '.apk',
              caption: `✨ *APK Details* ✨\n\n📱 *App Name:* ${apkData.name}\n🔄 *Last Updated:* ${apkData.lastup}\n📦 *Package Name:* ${apkData.package}\n\n🔥 *Get the latest version now! 🔥`
            },
            { quoted: m }
          );
        } catch (error) {
          return m.reply(`*[❗] An error occurred. Please try again later.*`);
        }
};
handler.help = ["apkmod"].map((a) => a + " *[search/url]*");
handler.tags = ["downloader"];
handler.command = ["apkmod", "happymod", "apk"];

module.exports = handler