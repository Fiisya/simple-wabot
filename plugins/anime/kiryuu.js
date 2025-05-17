//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : anime/kiryuu


const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {
    writeFile,
    unlink
} = require('fs');
let nazandCounter = 1;
async function searchKiryuu(query) {
    const url = `https://kiryuu.one/?s=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const results = $(".listupd .bsx a")
            .map((index, element) => {
                const elementData = $(element);
                const title = elementData.attr("title");
                const link = elementData.attr("href");
                return {
                    title,
                    link,
                };
            })
            .get();

        return results;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getKiryuuDetail(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('h1.entry-title').text().trim();
        const chapters = $('div.chapters > ul > li > a').map((_, el) => {
            const chapterLink = $(el).attr('href');
            const chapterTitle = $(el).text().trim();
            return {
                chapterTitle,
                chapterLink
            };
        }).get();

        return {
            title,
            chapters,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getDownloadLink(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const downloadLink = $("div.dt .dload").attr("href");

        if (downloadLink) {
            return downloadLink;
        } else {
            throw new Error("Link download tidak ditemukan.");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        writeFile(filename, buffer, (err) => {
            if (err) {
                console.error(err);
                return null;
            }
        });
    } catch (error) {
        console.error("Error downloading file:", error);
        return null;
    }
}

async function deleteFile(filename) {
    try {
        setTimeout(() => {
            unlink(filename, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log(`File ${filename} deleted successfully.`);
                }
            });
        }, 5000);
    } catch (error) {
        console.error("Error deleting file:", error);
    }
}

const handler = async (m, {
    conn,
    args
}) => {
    try {
        if (args.length === 0) {
            return conn.sendMessage(m.chat, {
                text: `Salah
            ☘️ Example:
            - 📌kiryuu search query
            - 📌kiryuu detail url
            - 📌kiryuu download url`
            }, {
                quoted: m
            });
        }

        if (args[0] === 'search') {
            const query = args.slice(1).join(' ');
            const results = await searchKiryuu(query);
            if (results.length === 0) {
                return conn.sendMessage(m.chat, {
                    text: 'Tidak ada hasil untuk pencarian tersebut.'
                }, {
                    quoted: m
                });
            }
            const message = results.map((result, index) => {
                return `- ${index + 1}. *${result.title}*\nLink: ${result.link}`;
            }).join('\n\n');
            return conn.sendMessage(m.chat, {
                text: message
            }, {
                quoted: m
            });
        } else if (args[0] === 'detail') {
            const url = args[1];
            const detail = await getKiryuuDetail(url);
            if (!detail) {
                return conn.sendMessage(m.chat, {
                    text: 'Detail manga tidak ditemukan.'
                }, {
                    quoted: m
                });
            }

            const message = `
*Title:* ${detail.title}
*Chapters:* ${detail.chapters.length} chapters
            `.trim();
            return conn.sendMessage(m.chat, {
                text: message
            }, {
                quoted: m
            });
        } else if (args[0] === 'download') {
            const url = args[1];
            const downloadLink = await getDownloadLink(url);
            if (!downloadLink) {
                return conn.sendMessage(m.chat, {
                    text: 'Link download tidak ada.'
                }, {
                    quoted: m
                });
            }
            const detail = await getKiryuuDetail(url);
            const chapter = detail.chapters[0];
            const filename = `${detail.title.replace(/[^a-zA-Z0-9]/g, '-')}-chapter1-${nazandCounter}.zip`;
            await downloadFile(downloadLink, filename);
            nazandCounter++;

            conn.sendMessage(m.chat, {
                document: {
                    url: `./${filename}`
                },
                mimetype: 'application/zip',
                fileName: filename
            }, {
                quoted: m
            });
            await deleteFile(filename);
        }

        return conn.sendMessage(m.chat, {
            text: `Salah
            ☘️ Example:
            - 📌kiryuu search query
            - 📌kiryuu detail url
            - 📌kiryuu download url`
        }, {
            quoted: m
        });

    } catch (error) {
        console.error(error);
        return conn.sendMessage(m.chat, {
            text: `${error.message}`
        }, {
            quoted: m
        });
    }
};

handler.command = ['kiryuu'];
handler.tags = ['anime'];
handler.help = ['kiryuu search query', 'kiryuu detail link', 'kiryuu download link'];
handler.limit = true;
module.exports = handler;