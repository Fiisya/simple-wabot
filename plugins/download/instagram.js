import axios from 'axios';

const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *INSTAGRAM DOWNLOADER* 」\n│\n│ Masukkan URL Instagram yang ingin di-download.\n│\n│ Contoh:\n│ ${usedPrefix + command} https://www.instagram.com/reel/DVl0lqUDJG7/\n│ ${usedPrefix + command} https://www.instagram.com/p/xxx\n└───────────────⭓`);
  }

  try {
    await m.reply(global.wait);

    const apiUrl = `https://api.siputzx.my.id/api/d/savefrom?url=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = response.data;

    if (!result.success || !result.data || result.data.length === 0) {
      return m.reply('❌ Gagal mengambil konten dari Instagram~');
    }

    let mediaCount = 0;
    for (const item of result.data) {
      if (!item.data || item.data.length === 0) continue;

      for (const media of item.data) {
        const { meta, url, thumb } = media;
        if (!url || url.length === 0) continue;
        const downloadInfo = url[0];
        const downloadUrl = downloadInfo.url;
        const fileType = downloadInfo.type?.toLowerCase() || '';
        const fileExt = downloadInfo.ext?.toLowerCase() || '';
        
        const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExt);
        const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(fileExt);
        
        if (!isVideo && !isImage) {
          console.log('[IG] Unknown file type:', fileExt, '- Skipping');
          continue;
        }

        mediaCount++;

        try {
          if (isVideo) {
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              mimetype: 'video/mp4',
              fileName: `ig_${meta?.shortcode || 'video'}_${mediaCount}.mp4`
            }, { quoted: m });
            
          } else if (isImage) {
            await conn.sendMessage(m.chat, {
              image: { url: downloadUrl },
              mimetype: 'image/jpeg',
              fileName: `ig_${meta?.shortcode || 'image'}_${mediaCount}.jpg`
            }, { quoted: m });
          }
          
          if (mediaCount > 0) await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (sendErr) {
          console.error('[IG] Error sending media:', sendErr);
          
          try {
            await conn.sendMessage(m.chat, {
              document: { url: downloadUrl },
              mimetype: isVideo ? 'video/mp4' : 'image/jpeg',
              fileName: `ig_${meta?.shortcode || 'media'}_${mediaCount}.${isVideo ? 'mp4' : 'jpg'}`
            }, { quoted: m });
          } catch (docErr) {
            await m.reply(downloadUrl);
          }
        }
      }
    }

    if (mediaCount === 0) {
      return m.reply('❌ Media tidak ditemukan');
    }

  } catch (err) {
    console.error('[IG Error]', err.message);
    m.reply(`❌ Error: ${err.message}`);
  }
};

handler.help = ['instagram <url>'];
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl|igdownload)$/i;
handler.limit = 2;

export default handler;
