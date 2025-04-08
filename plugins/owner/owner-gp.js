const fs = require("fs");

module.exports = {
    help: ["getplugins"].map((a) => a + " *[filename]*"),
    tags: ["owner"],
    command: ["gp", "getplugins"],
    code: async (m, {
        conn,
        usedPrefix,
        command,
        text,
        isOwner,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate,
    }) => {
        let ListPlugins = Object.keys(plugins).map((a) =>
            a.split("/plugins/")[1]
        );
        if (!text)
            throw `*• Example :* ${usedPrefix + command} *[filename]*

* *List Plugins ( ${ListPlugins.length} Files ) :*
${ListPlugins.map((a, i) => `*${i + 1}.* ${a}`).join("\n")}`;
        m.reply(wait);
        if (isNaN(text)) {
            if (
                !fs.existsSync(process.cwd() + "/plugins/" + text)
            )
                throw `*• Example :* ${usedPrefix + command} *[filename]*

* *List Plugins ( ${ListPlugins.length} Files ) :*
${ListPlugins.map((a, i) => `*${i + 1}.* ${a}`).join("\n")}`;
            m.reply(
                fs.readFileSync(process.cwd() + "/plugins/" + text).toString()
            );
        } else {
            if (
                !fs.existsSync(
                    process.cwd() + "/plugins/" + ListPlugins[text - 1]
                )
            )
                throw `*• Example :* ${usedPrefix + command} *[filename]*

* *List Plugins ( ${ListPlugins.length} Files ) :*
${ListPlugins.map((a, i) => `*${i + 1}.* ${a}`).join("\n")}`;
            m.reply(
                fs
                .readFileSync(
                    process.cwd() + "/plugins/" + ListPlugins[text - 1]
                )
                .toString()
            );
        }
    },
    owner: true
};