//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/lirik


const cheerio = require('cheerio');

async function googleLyrics(judulLagu) {
    try {
        const response = await fetch(`https://r.jina.ai/https://www.google.com/search?q=lirik+lagu+${encodeURIComponent(judulLagu)}&hl=en`, {
            headers: {
                'x-return-format': 'html',
                'x-engine': 'cf-browser-rendering',
            }
        });

        const text = await response.text();
        const $ = cheerio.load(text);
        const lirik = [];
        const output = [];
        const result = {};

        // Ambil informasi dari elemen hasil pencarian Google
        $('div.PZPZlf').each((i, e) => {
            const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
            if (!penemu) output.push($(e).text().trim());
        });

        // Ambil lirik lagu
        $('div[jsname="U8S5sf"]').each((i, el) => {
            let out = '';
            $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
                out += $(span).text() + '\n';
            });
            lirik.push(out.trim());
        });

        result.lyrics = lirik.join('\n\n') || "Lirik tidak ditemukan.";
        result.title = output.shift() || judulLagu;
        result.subtitle = output.shift() || "Tidak diketahui";
        result.platform = output.filter(_ => !_.includes(':'));

        output.forEach(_ => {
            if (_.includes(':')) {
                const [name, value] = _.split(':');
                result[name.toLowerCase()] = value.trim();
            }
        });

        return result;
    } catch (error) {
        return {
            error: error.message
        };
    }
}

let handler = async (m, {
    text,
    conn
}) => {
    if (!text) return m.reply("Mana query-nya? Masukin judul lagu yang mau dicari!");

    let res = await googleLyrics(text);
    if (res.error) return m.reply("Terjadi kesalahan saat mengambil lirik: " + res.error);

    let message = `🎵 *Judul:* ${res.title}\n📜 *Subtitle:* ${res.subtitle}\n\n${res.lyrics}`;

    conn.sendMessage(
        m.chat, {
            text: message,
        }, {
            quoted: m
        }
    );
};

handler.help = ['lirik'].map(a => a + " *[name song]*");
handler.command = ['lirik', 'lyric', 'liyrics'];
handler.tags = ['music'];

module.exports = handler;
