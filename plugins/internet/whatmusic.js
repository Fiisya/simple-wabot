/*Code By Nazir
 * Credits : Nazir
 * GcBot : https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP
 * !Note : Jangan Perjualbelikan Script ini tanpa izin @Nazir
 */

const acrcloud = require("acrcloud");

module.exports = {
    help: ["whatmusic"],
    tags: ["internet"],
    command: ["whatmusic", "laguapa", "whatsong", "namelagu", "musicinfo", "infomusic"],
    code: async (m, {
        conn,
        usedPrefix,
        command,
        text,
        isOwner,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate
    }) => {
        
        let q = m.quoted ? m.quoted : m;

    let mime = (q.msg || q).mimetype || "";
       
        if (!/audio|video/.test(mime))
            throw "[ ⚠️] *Cant Use, Plase Send Audio For Get Info Audio*";
        let buffer = await q.download();
        let data = await whatmusic(buffer);

        if (!data || data.length === 0)
            throw "Cant Find Audio";

        let caption = `🎵 *What Music - Finder* 🎵\n\n`;
        for (let result of data) {
            caption += `🎶 *Judul:* ${result.title}\n`;
            caption += `🎤 *Artis:* ${result.artist}\n`;
            caption += `⏱️ *Durasi:* ${result.duration}\n`;
            caption += `🔗 *Sumber:* ${result.url.filter((x) => x).join("\n") || "Tidak ditemukan"}\n\n`;
        }
        await m.reply(caption);
    }
};

const acr = new acrcloud({
    host: "identify-ap-southeast-1.acrcloud.com",
    access_key: "ee1b81b47cf98cd73a0072a761558ab1",
    access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI",
});

async function whatmusic(buffer) {
    let response = await acr.identify(buffer);
    let metadata = response.metadata;
    if (!metadata || !metadata.music) return [];

    return metadata.music.map((song) => ({
        title: song.title,
        artist: song.artists.map((a) => a.name)[0],
        score: song.score,
        release: new Date(song.release_date).toLocaleDateString("id-ID"),
        duration: toTime(song.duration_ms),
        url: Object.keys(song.external_metadata)
            .map((key) =>
                key === "youtube" ?
                "https://youtu.be/" + song.external_metadata[key].vid :
                key === "deezer" ?
                "https://www.deezer.com/us/track/" +
                song.external_metadata[key].track.id :
                key === "spotify" ?
                "https://open.spotify.com/track/" +
                song.external_metadata[key].track.id :
                "",
            )
            .filter(Boolean),
    }));
}

function toTime(ms) {
    let minutes = Math.floor(ms / 60000) % 60;
    let seconds = Math.floor(ms / 1000) % 60;
    return [minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":");
}