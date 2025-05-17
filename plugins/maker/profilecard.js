//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : maker/profilecard


/*
Takashi Yamada
*Note :* Instal Canvas Terlebih Dahulu, Lalu Jika Ingin Convert Silahkan Kasih URL Ch Ini
*/

const {
    createCanvas,
    loadImage
} = require('canvas');

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    try {
        // Jika tidak ada input, minta input
        if (args.length === 0) {
            await m.reply(`Kartu profil tidak dapat dibuat tanpa input. Silakan kirimkan perintah dengan format: \n\n*Nama|Username|Status|Bahasa|Editor|Hobi|Tanggal Bergabung*\n\nContoh: ${usedPrefix + command} Takashi Yamada|@shoyutakashi|Playing on Spotify|JS|Visual Studio Code|I like to code|2022-05-01`);
            return;
        }

        // Pisahkan input berdasarkan |
        let [name, username, playing, language, editor, hobby, memberSince] = args.join(' ').split('|');

        let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/8zYj1Kb/avatar.jpg');
        let bg = await loadImage('https://i.supa.codes/mOMarh');
        const canvas = createCanvas(800, 500);
        const ctx = canvas.getContext('2d');

        // Draw background
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create rounded rectangle background for profile card
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.roundRect(40, 40, 720, 420, 30);
        ctx.fill();

        // Draw user avatar
        let avatar = await loadImage(pp);
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 160, 80, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 60, 80, 160, 160);
        ctx.restore();

        // Add name and username
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px Sans';
        ctx.fillText(name, 260, 110);

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '24px Sans';
        ctx.fillText(username, 260, 150);

        // Add social indicator
        ctx.fillStyle = '#007acc';
        ctx.beginPath();
        ctx.arc(260 + ctx.measureText(username).width + 25, 140, 8, 0, Math.PI * 2);
        ctx.fill();

        // Add current activity (Playing status)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Sans';
        ctx.fillText(playing, 60, 290);

        // Add language icon and text
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(60, 310, 30, 30);

        ctx.fillStyle = '#111111';
        ctx.font = 'bold 20px Sans';
        ctx.fillText(language, 66, 333);

        // Add editor and hobby
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Sans';
        ctx.fillText(editor, 110, 330);

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '18px Sans';
        ctx.fillText(hobby, 110, 360);

        // Add "MEMBER SINCE" section
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Sans';
        ctx.fillText('MEMBER SINCE', 60, 430);

        ctx.fillStyle = '#dddddd';
        ctx.font = '18px Sans';
        ctx.fillText(memberSince, 60, 460);

        // Send the image
        await conn.sendMessage(m.chat, {
            image: canvas.toBuffer('image/png'),
            fileName: 'canvas-profile.png'
        }, {
            quoted: m
        });
    } catch (e) {
        console.error(e);
        await m.reply('Terjadi kesalahan saat membuat kartu profil.');
    }
};

handler.help = ['profilecard *[input]*'];
handler.tags = ['maker'];
handler.command = /^profilecard$/i;

module.exports = handler;