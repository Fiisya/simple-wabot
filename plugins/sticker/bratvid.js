const axios = require("axios");
const {
    execSync
} = require("child_process");
const fs = require("fs");
const path = require("path");
let moment = require("moment-timezone");

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`*• Example :* ${usedPrefix + command} *[input text]*`);
    }
    try {
        const words = text.split(" ");
        const tempDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const framePaths = [];

        for (let i = 0; i < words.length; i++) {
            const currentText = words.slice(0, i + 1).join(" ");

            const res = await axios
                .get(
                    `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(currentText)}`, {
                        responseType: "arraybuffer",
                    },
                )
                .catch((e) => e.response);

            const framePath = path.join(tempDir, `frame${i}.mp4`);
            fs.writeFileSync(framePath, res.data);
            framePaths.push(framePath);
        }

        const fileListPath = path.join(tempDir, "filelist.txt");
        let fileListContent = "";

        for (let i = 0; i < framePaths.length; i++) {
            fileListContent += `file '${framePaths[i]}'\n`;
            fileListContent += `duration 0.5\n`; // Durasi setiap frame 500 milidetik
        }

        fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
        fileListContent += `duration 3\n`; // Frame terakhir memiliki durasi 3 detik

        fs.writeFileSync(fileListPath, fileListContent);

        const outputVideoPath = path.join(tempDir, "output.mp4");
        execSync(
            `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${outputVideoPath}`,
        );

        await conn.sendImageAsSticker(m.chat, outputVideoPath, m, {
            packname: `Time : ${moment.tz("Asia/Makassar")}\n`,
            author: `Created By ${m.name}\n By © Asyl`,
        });

        framePaths.forEach((filePath) => fs.unlinkSync(filePath));
        fs.unlinkSync(fileListPath);
        fs.unlinkSync(outputVideoPath);
    } catch (err) {
        console.error(err);
        m.reply("Maaf, terjadi kesalahan saat memproses permintaan.");
    }
};

handler.help = ["bratvid"].map((a) => a + " *[text]*");
handler.tags = ["sticker"];
handler.command = ["bratvid"];
handler.premium = false;

module.exports = handler;