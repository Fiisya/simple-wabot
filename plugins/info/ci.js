module.exports = {
    help: ["ci", "channelinfo", "cekidch"].map(a => a + " *[url channelwa]*"),
    tags: ["tools", "info"],
    command: ["ci", "channelinfo", "cekidch'],
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
        if (!text) throw `*• Example :* ${usedPrefix + command} *[url channel]*`
        m.reply(wait);
        let data = Func.isUrl(text);
        for (let url of data) {
            let idch = getIdChannel(url);
            let json = await conn.newsletterMetadata("invite", idch);
            conn.sendButton(m.chat, [], m, {
                body: "*乂 N E W S L E T T E R - I N F O*\n\n" + Object.entries(json).map(([a, b]) => `- *${a}* : ${b}`).join("\n"),
                ...(json.preview ? {
                    url: "https://pps.whatsapp.net" + json.preview
                } : {})
            })
        }
    }
}

function getIdChannel(url) {
    const regex = /channel\/([^\/]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}