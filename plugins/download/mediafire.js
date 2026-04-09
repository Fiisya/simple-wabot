import axios from 'axios';
import * as cheerio from 'cheerio';
import { alfisy } from '../../lib/api.js';

class MediaFire {
  constructor() {
    this.baseHeaders = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'max-age=0',
      'Priority': 'u=0, i',
      'Sec-Ch-Ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Linux"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
    };
    this.cookieString = '';
    this.client = axios.create({ timeout: 30000, maxRedirects: 5, headers: this.baseHeaders });
    this.client.interceptors.response.use((response) => {
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        setCookieHeader.forEach(cookie => {
          const cookieParts = cookie.split(';')[0].split('=');
          if (cookieParts.length >= 2) {
            const cookieName = cookieParts[0];
            const cookieValue = cookieParts.slice(1).join('=');
            if (!this.cookieString.includes(`${cookieName}=`)) {
              this.cookieString += (this.cookieString ? '; ' : '') + `${cookieName}=${cookieValue}`;
            }
          }
        });
        this.client.defaults.headers.common['Cookie'] = this.cookieString;
      }
      return response;
    });
  }

  async getFileInfo(url) {
    const response = await this.client.get(url);
    const $ = cheerio.load(response.data);
    
    const downloadLink = $('#downloadButton').attr('href');
    const fileName = $('.dl-btn-label').attr('title') || $('.promoDownloadName .dl-btn-label').text().trim() || null;
    const fileSize = $('.download_link .input').text().match(/\(([^)]+)\)/)?.[1] || null;
    const fileExtension = fileName ? fileName.split('.').pop() : null;
    const securityToken = $('input[name="security"]').val() || null;
    
    return {
      success: true,
      data: {
        fileName,
        fileSize,
        fileExtension,
        directDownloadUrl: downloadLink || null,
        mediafireUrl: url,
        securityToken
      }
    };
  }

  async download(url) {
    const fileInfo = await this.getFileInfo(url);
    const { fileName, fileExtension, directDownloadUrl, fileSize } = fileInfo.data;
    
    const { data: fileBuf, headers } = await this.client.get(directDownloadUrl, {
      responseType: 'arraybuffer',
      timeout: 120000
    });

    const finalFileName = fileName || `${fileInfo.data.quickKey || 'file'}.${fileExtension || 'bin'}`;
    const finalFileSize = fileSize || `${(fileBuf.length / 1024 / 1024).toFixed(2)} MB`;
    const mimeType = headers['content-type'] || 'application/octet-stream';

    return {
      buffer: Buffer.from(fileBuf),
      fileName: finalFileName,
      fileSize: finalFileSize,
      mimeType
    };
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://www.mediafire.com/file/xxx/file.apk`);
  m.reply(global.wait);

  try {
    const downloader = new MediaFire();
    const result = await downloader.download(text);

    await conn.sendMessage(m.chat, {
      document: result.buffer,
      fileName: result.fileName,
      mimetype: result.mimeType,
      caption: `*📥 MEDIAFIRE DOWNLOAD*\n\n📌 ${result.fileName}\n📁 ${result.fileSize}`
    }, { quoted: m });

  } catch (e) {
    console.error('[MF Error]', e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = /^(mediafire|mf)$/i;
handler.limit = 2;

export default handler;
