import axios from 'axios';
import yts from 'yt-search';

class YouTubeDownloader {
    constructor() {
        this.apis = [
            { name: 'Alfisy', url: 'https://api.alfisy.my.id/api/download/youtube' },
            { name: 'Clipto', url: 'https://www.clipto.com/api/youtube', method: 'post' }
        ];
    }

    async download(url) {
        let lastError;
        
        for (const api of this.apis) {
            try {
                console.log(`[YT-DL] Trying ${api.name}...`);
                
                let response;
                if (api.method === 'post') {
                    response = await axios.post(api.url, { url }, {
                        headers: {
                            'content-type': 'application/json',
                            'referer': 'https://www.clipto.com',
                            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
                        },
                        timeout: 15000
                    });
                } else {
                    const encodedUrl = encodeURIComponent(url);
                    response = await axios.get(`${api.url}?url=${encodedUrl}`, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                        timeout: 15000
                    });
                }

                // Normalisasi response
                const data = this.normalizeResponse(response.data, api.name);
                if (data && (data.videos?.length > 0 || data.medias?.length > 0)) {
                    return data;
                }
                
            } catch (err) {
                lastError = err;
                console.log(`[YT-DL] ${api.name} failed: ${err.message}`);
            }
        }
        
        throw new Error(`All APIs failed. Last error: ${lastError?.message}`);
    }

    normalizeResponse(data, apiName) {
        if (apiName === 'Clipto') {
            // Transform Clipto format ke format standar
            return {
                title: data.title,
                thumbnail: data.thumbnail,
                duration: data.duration,
                videos: data.medias?.map(m => ({
                    quality: m.height || m.quality,
                    label: m.label,
                    url: m.url,
                    type: m.type,
                    ext: m.ext
                })) || []
            };
        }
        return data; // Alfisy format (sudah standar)
    }

    formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Handler untuk WhatsApp Bot
const ytdl = new YouTubeDownloader();

let handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!args[0]) {
        return m.reply(`🎬 *YouTube Downloader*
        
📥 *Commands:*
• ${usedPrefix}ytmp3 <url/query> - Download Audio
• ${usedPrefix}ytmp4 <url/query> - Download Video

📝 *Examples:*
${usedPrefix}ytmp4 https://youtu.be/xxxxx
${usedPrefix}ytmp3 faded alan walker`);
    }

    const query = args.join(" ");
    const isAudio = /yt(a|mp3|audio)/i.test(command);
    
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    try {
        // Search jika bukan URL
        let videoUrl = query;
        let videoInfo = null;

        if (!/youtu\.be|youtube\.com/.test(query)) {
            await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });
            const search = await yts(query);
            if (!search.videos?.length) throw new Error('Video not found');
            
            videoUrl = search.videos[0].url;
            videoInfo = search.videos[0];
        } else {
            const videoId = query.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
            if (videoId) videoInfo = await yts({ videoId });
        }

        await conn.sendMessage(m.chat, { react: { text: '⬇️', key: m.key } });

        // Download
        const result = await ytdl.download(videoUrl);
        const formats = result.videos || result.medias || [];

        if (!formats.length) throw new Error('No download formats available');

        // Pilih format terbaik
        let selected;
        if (isAudio) {
            // Prioritas: Opus high bitrate > M4A > MP3
            selected = formats.find(f => f.label?.includes('opus') && f.bitrate > 100000) ||
                      formats.find(f => f.label?.includes('m4a') && f.bitrate > 100000) ||
                      formats.find(f => f.ext === 'mp3' || f.type === 'audio') ||
                      formats[formats.length - 1];
        } else {
            // Prioritas: 720p > 480p > 360p
            selected = formats.find(f => f.quality === 720 || f.label?.includes('720p')) ||
                      formats.find(f => f.quality === 480 || f.label?.includes('480p')) ||
                      formats.find(f => f.quality === 360 || f.label?.includes('360p')) ||
                      formats[0];
        }

        const caption = `✅ *Download Ready!*

📌 *Title:* ${result.title}
👤 *Channel:* ${videoInfo?.author?.name || 'Unknown'}
⏱️ *Duration:* ${ytdl.formatDuration(result.duration || videoInfo?.seconds)}
📊 *Quality:* ${selected.label || selected.quality + 'p'}
💾 *Size:* ${selected.size || 'Unknown'}
🎵 *Type:* ${isAudio ? 'Audio' : 'Video'}`;

        await conn.sendMessage(m.chat, { react: { text: '⬆️', key: m.key } });

        // Kirim file
        if (isAudio) {
            await conn.sendMessage(m.chat, {
                audio: { url: selected.url },
                mimetype: 'audio/mpeg',
                fileName: `${result.title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: result.title,
                        body: `🎵 ${videoInfo?.author?.name || 'YouTube'}`,
                        thumbnailUrl: result.thumbnail,
                        sourceUrl: videoUrl,
                        mediaType: 1
                    }
                }
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                video: { url: selected.url },
                caption: caption,
                mimetype: 'video/mp4',
                fileName: `${result.title}.mp4`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('[YT-DL ERROR]', err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`❌ *Error:* ${err.message}`);
    }
};

handler.help = ['ytmp3', 'ytmp4'];
handler.tags = ['downloader'];
handler.command = /^yt(mp3|mp4|a|v)$/i;
handler.limit = true;

export default handler;