module.exports = {
    help: ["readviewonce"].map(a => a + " *[reply viewonce]*"),
    tags: ["tools"],
    command: ["rvo", "readviewonce", "liat", "intip"],
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
        let {
            downloadContentFromMessage
        } = require("baileys");

        if (!m.quoted) throw "where's message?";
        let msg = m.quoted?.message;
        let type = Object.keys(msg)[0];
        let media = await downloadContentFromMessage(msg[type], type === "imageMessage" ? "image" : "video");
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        if (/video/.test(type)) {
            return await conn.sendFile(m.chat, buffer, "media.mp4", msg[type].caption || "", m);
        } else if (/image/.test(type)) {
            return await conn.sendFile(m.chat, buffer, "media.jpg", msg[type].caption || "", m);
        }
    }
}