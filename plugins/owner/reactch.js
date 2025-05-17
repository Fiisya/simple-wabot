//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : owner/reactch


var xStr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ' ']
var yStr = Object.freeze({
    1: ['🅐', '🅑', '🅒', '🅓', '🅔', '🅕', '🅖', '🅗', '🅘', '🅙', '🅚', '🅛', '🅜', '🅝', '🅞', '🅟', '🅠', '🅡', '🅢', '🅣', '🅤', '🅥', '🅦', '🅧', '🅨', '🅩', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '➖'],
})
async function style(text, style = 1) {
    var replacer = []
    xStr.map((v, i) => replacer.push({
        original: v,
        convert: yStr[style][i]
    }))
    var str = text.toLowerCase().split('')
    var output = []
    str.map(v => {
        const find = replacer.find(x => x.original == v)
        find ? output.push(find.convert) : output.push(v)
    })
    return output.join('')
}

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply("Contoh penggunaan: .rch https://whatsapp.com/channel/xxx Hai");

    let args = text.split(" ");
    if (args.length < 2) return m.reply("Format salah! Contoh: .rch https://whatsapp.com/channel/xxx Hai");

    let url = args[0];
    let rawText = args.slice(1).join(" ");
    let emoji = await style(rawText);

    let result = url.split('https://whatsapp.com/channel/')[1];
    let [id, kode] = result.split("/");
    let res = await conn.newsletterMetadata("invite", id);
    try {
        await conn.newsletterReactMessage(res.id, kode, emoji);
        m.reply(`Reaksi berhasil dikirim ke ${res.name} dengan kode ${kode} dan emoji: ${emoji}`);
    } catch (error) {
        m.reply(`Gagal mengirim reaksi: ${error.message}`);
    }
};

handler.help = ['reactch'];
handler.tags = ['owner'];
handler.command = ['reactch', 'rch'];
handler.owner = true;
handler.register = true;

module.exports = handler;