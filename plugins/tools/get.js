const undici = require("undici");
const {
    extension
} = require("mime-types");
const {
  html
} = require("js-beautify");

function isUrl(string) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let result = string.match(urlRegex);
    return result;
}
module.exports = {
    help: ["get"].map(a => a + " *[url]*"),
    tags: ["tools"],
    command: ["get"],
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
        if (!text) throw `*• Example :* ${usedPrefix + command} *[url]*`;
        m.reply(wait);
        for (let i of isUrl(text)) {
            let data = await undici.fetch(i);
            let mime = data.headers.get("content-type").split(";")[0];
            let cap = `乂 *F E T C H  -  U R L*
    ◦  Request : ${i}
    ◦  Mimetype : ${mime}`;

            let body;
            if (/\html/ig.test(mime)) {
                body = await data.text();
            } else if (/\json/ig.test(mime)) {
                body = await data.json();
            } else if (/image/ig.test(mime)) {
                body = await data.arrayBuffer();
            } else if (/video/ig.test(mime)) {
                body = await data.arrayBuffer();
            } else if (/audio/ig.test(mime)) {
                body = await data.arrayBuffer();
            } else {
                try {
                    body = await data.buffer();
                } catch (e) {
                    body = await data.text();
                }
            }

            if (/\html/ig.test(mime)) {
                await conn.sendMessage(m.chat, {
                    document: Buffer.from(html(body)),
                    caption: cap,
                    fileName: "result.html",
                    mimetype: mime,
                }, {
                    quoted: m
                });
            } else if (/\json/ig.test(mime)) {
                m.reply(JSON.stringify(body, null, 2));
            } else if (/image/ig.test(mime)) {
                conn.sendFile(m.chat, Buffer.from(body), `result.${extension(mime)}`, cap, m);
            } else if (/video/ig.test(mime)) {
                conn.sendFile(m.chat, Buffer.from(body), `result.${extension(mime)}`, cap, m);
            } else if (/audio/ig.test(mime)) {
                conn.sendFile(m.chat, Buffer.from(body), `result.${extension(mime)}`, cap, m, {
                    mimetype: mime
                });
            } else {
                try {
                    conn.sendFile(m.chat, body, `result.${extension(mime)}`, cap, m, {
                        mimetype: mime
                    });
                } catch (e) {
                    await conn.sendCopy(m.chat, [
                        [`COPY RESULT`, body]
                    ], m, {
                        body: `${cap}

${Func.texted("monospace", body)}`
                    });
                }
            }
        }
    }
}