//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : _event/eval.js
// Sumber: https://chat.whatsapp.com/DwiyKDLAuwjHqjPasln3WP


const util = require("util");
const {
    exec
} = require("child_process");

module.exports = {
    before: async (m, {
        conn,
        isOwner
    }) => {
        if (m.text.startsWith("=>")) {
            if (!isOwner) return;
            m.reply(wait);
            try {
                const result = await eval(
                    `(async () => { return ${m.text.slice(3)} })()`,
                );
                m.reply(util.format(result));
            } catch (e) {
                m.reply(util.format(e))
            }
        } else if (m.text.startsWith(">")) {
            if (!isOwner) return;
            m.reply(wait);
            try {
                const result = await eval(`(async() => { 
${m.text.slice(2)}
})()`);
                m.reply(util.format(result));
            } catch (e) {
                m.reply(util.format(e))
            }
        } else if (m.text.startsWith("$")) {
            if (!isOwner) return;
            let {
                key
            } = await conn.sendMessage(
                m.chat, {
                    text: "executed...",
                }, {
                    quoted: m,
                },
            );
            exec(m.text.slice(2), async (err, stdout) => {
                if (err)
                    return await conn.sendMessage(m.chat, {
                        text: util.format(err),
                        edit: key,
                    });
                if (stdout)
                    return await conn.sendMessage(m.chat, {
                        text: stdout,
                        edit: key,
                    });
            });
        } else return
    },
};
