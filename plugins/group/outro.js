//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/outro


const handler = async (m, {
    conn
}) => {
    await conn.reply(m.chat, 'Terima kasih udah jadi bagian grup! 👋', m);
};

handler.command = /^outrod$/i;
handler.tags = ['group'];
handler.help = ['outro'];
handler.group = true;
module.exports = handler;