//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : owner-backupsc


const fs = require('fs');
const {
    exec
} = require('child_process');
const {
    promisify
} = require('util');

const exec_ = promisify(exec);

const handler = async (m, {
    conn
}) => {
    if (m.chat === '120363217994871358@g.us') { // Ensure this comparison is strict
        try {
            const zipFileName = `Asyl.zip`;

            m.reply("Sedang memulai proses backup. Harap tunggu...");

            // Set a delay of 1 second before starting the backup process
            setTimeout(async () => {
                const zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;

                try {
                    await exec_(zipCommand);

                    // Check if the zip file was created successfully
                    if (fs.existsSync(zipFileName)) {
                        // Delay 2 seconds before sending the backup file
                        setTimeout(() => {
                            const file = fs.readFileSync(zipFileName);
                            conn.sendMessage(
                                m.chat, {
                                    document: file,
                                    mimetype: "application/zip",
                                    fileName: zipFileName,
                                    caption: "Backup selesai. Silakan unduh file backup.",
                                }, {
                                    quoted: m
                                }
                            );

                            // Delete the zip file after 5 seconds
                            setTimeout(() => {
                                fs.unlinkSync(zipFileName);
                                m.reply("File backup telah dihapus.");
                            }, 5000);
                        }, 2000);
                    } else {
                        m.reply("Gagal membuat file backup.");
                    }
                } catch (execError) {
                    console.error("Error during zip creation:", execError);
                    m.reply("Gagal membuat file backup.");
                }
            }, 1000);
        } catch (error) {
            m.reply("Terjadi kesalahan saat melakukan backup.");
            console.error("Error in backup process:", error);
        }
    } else {
        // Send message if the user is not in the correct group
        conn.sendMessage(m.chat, {
            text: '📣 Fitur khusus group owner',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'Join sekarang ❗',
                    body: '',
                    mediaType: 1,
                    thumbnailUrl: thumb,
                    sourceUrl: 'https://chat.whatsapp.com/L5OUiV1WF5EJLU2fDjR62C',
                    renderLargerThumbnail: false,
                }
            }
        }, {
            quoted: m
        });
    }
};

handler.help = ["backupsc"];
handler.tags = ["owner"];
handler.command = ["pibackup", "backupsc"];
handler.rowner = true; // Restrict this command to the owner
handler.private = false;

module.exports = handler;