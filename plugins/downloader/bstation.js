//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : tools/bstation


const axios = require('axios');
const cheerio = require('cheerio');

let handler = async (m, {
    conn,
    text
}) => {
    if (!/www.bilibili.com|bili.im/.test(text)) throw `⚠️Masukan Link Bstation !`;
    const a = await bstation(text, '720');
    let cap = ` ☂︎ Bstation Downloader\n📙 *Title:* ${a.result.metadata.title || ''}\n 🗾 *Locate:* ${a.result.metadata.locate || ''}\n ♥️ *Like:* ${a.result.metadata.like || ''}\n 👁️ *View:* ${a.result.metadata.view || ''}\n 📝 *Description:* ${a.result.metadata.description || ''}\n 🔗 *Link:* ${a.result.metadata.url || ''}`;
    await conn.sendMessage(m.chat, {
        image: {
            url: a.result.metadata.thumbnail
        },
        caption: cap
    }, {
        quoted: m
    });
    const {
        data
    } = await axios.get(a.result.download.url, {
        responseType: 'arraybuffer'
    });

    const convert = await converter(data, 'webp', 'mp4');
    await conn.sendMessage(m.chat, {
        video: convert,
        caption: ` 📙 *Title:* ${a.result.metadata.title || ''}\n 🗾 *Locate:* ${a.result.metadata.locate || ''}\n 🔗 *Link:* ${a.result.metadata.url || ''}`
    }, {
        quoted: m
    });
};

handler.help = ['bstation'].map(v => v + ' *[ Mendownload Bstation ]* ');
handler.tags = ['downloader', 'anime'];
handler.command = ['bstation', 'bilibili'];

module.exports = handler;

// Scraper Hasil Ai Sih Tapi Gw Remake Dikit
async function bstation(url, quality) {
    const scrapedData = {
        status: 500,
        content: false,
        result: {
            metadata: {},
            download: {}
        }
    };
    try {
        format = ["max", "4320", "2160", "1440", "1080", "720", "480", "360", "240", "144", "320", "256", "128", "96", "64", "8"];
        if (!/www.bilibili.com|bili.im/.test(url)) throw `⚠️Masukan Link Bstationnya !`;
        if (!format.includes(quality)) throw `⚠️Maaf Anda Salah Masukan Quality\n Contoh Quality:\n${format.map(a => `${a}`).join(', ')}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        const finalurl = response.request.res.responseUrl || url;
        scrapedData.status = 200 || 500;
        scrapedData.content = true || false;
        scrapedData.result.metadata.title = $('title').text().trim() || null;
        scrapedData.result.metadata.locate = $('meta[property="og:locale"]').attr('content') || null
        scrapedData.result.metadata.description = $('meta[name="description"]').attr('content') || null;
        scrapedData.result.metadata.thumbnail = $('meta[property="og:image"]').attr('content') || null;
        scrapedData.result.metadata.like = $('.interactive__btn.interactive__like .interactive__text').text() || null;
        scrapedData.result.metadata.view = $('.bstar-meta__tips-left .bstar-meta-text').first().text() || null;
        scrapedData.result.metadata.url = finalurl;

        const download = await axios.post("https://c.blahaj.ca/", {
            url: response.request.res.responseUrl,
            videoQuality: quality,
            downloadMode: "auto"
        }, {
            headers: {
                Accept: "application/json",
                "Content-type": "application/json"
            }
        }).then(a => a.data);
        scrapedData.result.download = download || null;
        return scrapedData;
    } catch (e) {
        scrapedData.result.metadata = 'Msg: ' + e
        scrapedData.result.download = 'Msg: ' + e
        return scrapedData
        console.log(scrapedData)
    }
};

async function converter(inputBuffer, inputFormat, outputFormat) {
    const {
        exec
    } = require('child_process');
    const {
        promisify
    } = require('util');
    const execPromise = promisify(exec);
    const fs = require('fs');
    const path = require('path');
    // Validate input types
    if (!Buffer.isBuffer(inputBuffer)) {
        throw new Error('Input must be a Buffer');
    }
    if (typeof inputFormat !== 'string' || typeof outputFormat !== 'string') {
        throw new Error('Input and output formats must be strings');
    }

    const inputFilePath = path.resolve(`./tmp/temp-${Date.now()}-input.${inputFormat}`);
    const outputFilePath = path.resolve(`./tmp/temp-${Date.now()}-output.${outputFormat}`);

    try {
        await fs.promises.writeFile(inputFilePath, inputBuffer);
        console.log('Input file written successfully.');

        console.log('Starting conversion...');
        await execPromise(`ffmpeg -i ${inputFilePath} ${outputFilePath}`);
        console.log('Conversion completed successfully.');

        const outputBuffer = await fs.promises.readFile(outputFilePath);
        return outputBuffer;
    } catch (error) {
        console.error('Error while converting file:', error);
        throw error; // Re-throw error for higher-level handling
    } finally {
        // Cleanup temporary files
        try {
            if (fs.existsSync(inputFilePath)) await fs.promises.unlink(inputFilePath);
            if (fs.existsSync(outputFilePath)) await fs.promises.unlink(outputFilePath);
        } catch (cleanupError) {
            console.error('Error while cleaning up temp files:', cleanupError);
        }
    }
}