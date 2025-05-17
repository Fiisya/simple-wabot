//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : internet/quote


const axios = require("axios");
const {
    createCanvas,
    loadImage
} = require("canvas");

let handler = async (m, {
    conn
}) => {
    try {
        let {
            data
        } = await axios.get('https://www.abella.icu/random-quotes');
        let q = data?.data;
        if (!q) return m.reply('Error');

        const width = 1200;
        const height = 800;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        const bgPattern = createCanvas(50, 50);
        const bgCtx = bgPattern.getContext('2d');
        bgCtx.fillStyle = '#e9ecef';
        bgCtx.fillRect(0, 0, 50, 50);
        bgCtx.strokeStyle = '#dee2e6';
        bgCtx.lineWidth = 2;
        bgCtx.strokeRect(0, 0, 50, 50);
        const pattern = ctx.createPattern(bgPattern, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(50, 50, width - 100, height - 100);

        ctx.strokeStyle = '#343a40';
        ctx.lineWidth = 8;
        ctx.strokeRect(75, 75, width - 150, height - 150);

        const accentColor = ['#ff6b6b', '#51cf66', '#339af0', '#9775fa'][Math.floor(Math.random() * 4)];
        ctx.fillStyle = accentColor;
        ctx.fillRect(100, 100, 20, height - 200);

        ctx.font = 'bold 48px "Georgia"';
        ctx.fillStyle = '#343a40';
        ctx.textAlign = 'center';

        const words = q.quote.split(' ');
        const maxLineLength = 35;
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length < maxLineLength) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);

        let yPos = height / 3;
        lines.forEach((line, i) => {
            ctx.fillStyle = i === Math.floor(lines.length / 2) ? accentColor : '#343a40';
            ctx.fillText(i === 0 ? `"${line}` : i === lines.length - 1 ? `${line}"` : line, width / 2 + 30, yPos);
            yPos += 60;
        });

        ctx.font = 'italic 36px "Georgia"';
        ctx.fillStyle = accentColor;
        ctx.fillText(`— ${q.author}`, width / 2 + 30, yPos + 40);

        ctx.font = '20px "Arial"';
        ctx.fillStyle = '#868e96';
        ctx.fillText(`Tags : ${q.tags.join(', ')}`, width / 2 + 30, yPos + 100);

        const buffer = canvas.toBuffer('image/png', {
            quality: 0.95,
            compressionLevel: 9
        });

        await conn.sendFile(m.chat, buffer, 'quote.png', `✨ ${q.quote} - ${q.author}`, m);

    } catch (e) {
        console.error(e);
        m.reply('Error Bjir');
    }
};

handler.help = ['quote'];
handler.command = ['quote'];
handler.tags = ['quotes']

module.exports = handler;