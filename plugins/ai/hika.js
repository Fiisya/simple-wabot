//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : ai/hika


const axios = require("axios");

let handler = async (m, {
    text,
    conn
}) => {
    if (!text) return m.reply('Mau Tanya Apa *Example :* apa itu node js');

    let {
        data
    } = await axios.get('https://www.abella.icu/hika-ai?q=' + encodeURIComponent(text));


    let res = data.data;
    await m.reply(res.answer.trim());

    let ref = res.references?.map((v, i) => `${i+1}. ${v.name}\n${v.url}`).join('\n\n');
    if (ref) await m.reply('Referensi :\n\n' + ref);
};

handler.help = ['hika']
handler.tags = ['ai']
handler.command = ['hika']

module.exports = handler;