//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/ceksn


const {
    createHash
} = require('crypto');

const handler = async function(m, {
    conn
}) {
    const generateSerialNumber = (sender) => {
        const hash = createHash("md5").update(sender).digest("hex");
        return hash;
    };

    let sn = generateSerialNumber(m.sender);

    await conn.sendButton(
        m.chat,
        [
            ["UNREGISTER", `.unreg ${sn}`]
        ],
        m, {
            body: `🗃️ *Your SN:*\n${sn}`
        }
    );
};

handler.help = ["ceksn"];
handler.tags = ["main"];
handler.command = ["ceksn"];
handler.register = true;

module.exports = handler;