const {
    generateWAMessage,
    areJidsSameUser,
    proto
} = require('baileys')

const handler = m => m;

handler.before = async function(m, { conn }) {
    conn.sendAliasMessage = async(jid, mess = {}, alias = {}, quoted = null) => {
        function check(arr) {
            if (!Array.isArray(arr)) {
                return false;
            }
            if (!arr.length) {
                return false;
            }
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (typeof item !== 'object' || item === null) {
                    return false;
                }
                if (!Object.prototype.hasOwnProperty.call(item, 'alias')) {
                    return false;
                }
                if (!Array.isArray(item.alias) && typeof item.alias !== 'string') {
                    return false;
                }
                if (Object.prototype.hasOwnProperty.call(item, 'response') && typeof item.response !== 'string') {
                    return false;
                }
                if (Object.prototype.hasOwnProperty.call(item, 'eval') && typeof item.eval !== 'string') {
                    return false;
                }
            }
            return true;
        }
        if (!check(alias)) return "Alias format is not valid!";
        let message = await conn.sendMessage(jid, mess, { quoted: quoted });
        if (typeof db.data.settings.alias[jid] === 'undefined') db.data.settings.alias[jid] = {};
        db.data.settings.alias[jid][message.key.id] = { chat: jid, id: message.key.id, alias };
        return message;
    };
 conn.sendInputMessage = async(jid, mess = {}, target = 'all', timeout = 60000, quoted = null) => {
        let time = Date.now();
        let message = await conn.sendMessage(jid, mess, { quoted: quoted });
        if (typeof db.data.settings.input[jid] === 'undefined') db.data.settings.input[jid] = {};
        db.data.settings.input[jid][message.key.id] = { chat: jid, id: message.key.id, target };

        while (((Date.now() - time) < timeout) && !db.data.settings.input[jid][message.key.id].hasOwnProperty("input")) await conn.delay(500);

        return db.data.settings.input[jid][message.key.id].input;
    };

    if (typeof db.data.settings.alias === 'undefined') db.data.settings.alias = {};
    if (typeof db.data.settings.input === 'undefined') db.data.settings.input = {};

    if (m.quoted) {
        const quotedId = m.quoted.id;
        if (db.data.settings.input[m.chat]?.[quotedId]?.target === 'all' || db.data.settings.input[m.chat]?.[quotedId]?.target === m.sender) {
            db.data.settings.input[m.chat][quotedId].input = m.text;
        }
        if (db.data.settings.alias.hasOwnProperty(m.chat)) {
            if (db.data.settings.alias[m.chat].hasOwnProperty(quotedId)) {
                for (const aliasObj of db.data.settings.alias[m.chat][quotedId].alias) {
                    if (Array.isArray(aliasObj.alias) && !aliasObj.alias.map(v => v.toLowerCase()).includes(m.text.toLowerCase())) continue;
                    else if (aliasObj.alias.toLowerCase() !== m.text.toLowerCase()) continue;
                    else {
                        if (aliasObj.response) await conn.appendTextMessage(m, aliasObj.response, m.chatUpdate);
                        if (aliasObj.eval) await eval(aliasObj.eval);
                    }
                }
            }
        }
    }
}

module.exports = handler;