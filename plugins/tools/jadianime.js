/*Simple WhatsApp bot
 * Credits : Bang_syaii
 * RestAPI : https://api.botwa.space
 * Community : https://api.botwa.space/s/gcbot
 */

const Websocket = require("ws");
const crypto = require("node:crypto");

const WS_URL = "wss://pixnova.ai/demo-photo2anime/queue/join";
const IMAGE_URL = "https://oss-global.pixnova.ai/";
const SESSION = crypto.randomBytes(5).toString("hex").slice(0, 9);
let wss;
let promise;

function _connect(log) {
    return new Promise((resolve, reject) => {
        wss = new Websocket(WS_URL);
        wss.on("open", () => {
            console.log("[ INFO ] Koneksi ke websocket tersambung.");
            resolve();
        })

        wss.on("error", (error) => {
            console.error("[ ERROR ] " + error);
            reject(error);
        })

        wss.on("message", (chunk) => {
            const data = JSON.parse(chunk.toString());
            if (promise && promise.once) {
                promise.call(data)
                promise = null;
            } else if (promise && !promise.once) {
                if (log) console.log(data);
                if (data?.code && data.code == 200 && data?.success && data.success == true) {
                    let amba = data;
                    amba.output.result.forEach((_, i) => {
                        amba.output.result[i] = IMAGE_URL + amba.output.result[i]
                    })
                    promise.call(amba);
                    promise = null;
                }
            }
        })
    })
}

function _send(payload, pr) {
    return new Promise(resolve => {
        wss.send(JSON.stringify(payload));
        if (pr) {
            promise = {
                once: true,
                call: resolve
            }
        } else {
            promise = {
                once: false,
                call: resolve
            }
        }
    })
}

async function PixNova(data, image, log) {
    let base64Image;
    if (/https\:\/\/|http\:\/\//i.test(image)) {
        const gs = await fetch(image);
        const kb = await gs.arrayBuffer();
        base64Image = Buffer.from(kb).toString("base64");
    } else if (Buffer.isBuffer(image)) {
        base64Image = image.toString("base64");
    } else {
        base64Image = image;
    }
    await _connect(log);
    let payload = {
        session_hash: SESSION
    }
    const resp = await _send(payload, true);
    if (log) console.log(`[ ${SESSION} ] Hash: ${JSON.stringify(resp, null, 2)}`);
    payload = {
        "data": {
            "source_image": `data:image/jpeg;base64,${base64Image}`,
            "strength": data?.strength || 0.6,
            "prompt": data.prompt,
            "negative_prompt": data.negative,
            "request_from": 2
        }
    }
    const out = await _send(payload, false);
    return out;
}
let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (!/image/.test(mime))
        throw "[ ⚠️] *Cant Use, Plase Send Image For Get Ethance ToAnime*";
    let media = await (m.quoted ? m.quoted.download() : m.download())
    let buffer = await q.download();
    let imagenya = await require(process.cwd() + "/lib/uploader.js").catbox(buffer);

    const IMAGE = imagenya;
    const LOGGER = true; // Menampilkan teks ke console selama proses
    const DATA = {
        prompt: "(masterpiece), best quality",
        negative: "(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres , username, blurry, trademark, watermark, title, multiple view, Reference sheet, curvy, plump, fat, strabismus, clothing cutout, side slit,worst hand, (ugly face:1.2), extra leg, extra arm, bad foot, text, name",
        strength: 0.6
    }
    const result = await PixNova(DATA, IMAGE, LOGGER)
    let image = result.output.result
    await conn.sendMessage(m.chat, {
        image: {
            url: image[0]
        },
        caption: `*乂 Jadianime*\n\n*Size:* ${Func.formatSize(media.length)}\n*Type:* image/png`
    }, { quoted: m })
};
handler.help = ["jadianime"].map((a) => a + " *[search/url]*");
handler.tags = ["tools"];
handler.command = ["jadianime", "toanime"];

module.exports = handler;