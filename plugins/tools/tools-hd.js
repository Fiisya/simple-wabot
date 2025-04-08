

const FormData = require('form-data');
const Jimp = require('jimp');

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    
    if (!mime) {
      return m.reply(`Harap reply gambar untuk meningkatkan *HD*.`);
    }
    
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Format file tidak didukung, silakan kirim atau balas gambar.`);
    }
    
    m.reply(`Meningkatkan kualitas gambar....`);
    
    let img = await q.download?.();
    let pr = await remini(img, "enhance");
    
    conn.sendMessage(m.chat, {
      image: pr,
      caption: `Berhasil Meningkatkan Kualitas Gambar`
    }, { quoted: m });

  } catch (error) {
    console.error(error); // Log error untuk debugging
    return m.reply(`Terjadi kesalahan.`);
  }
};

handler.help = ["hd"];
handler.tags = ["tools"];
handler.limit = true;
handler.register = true;
handler.command = ["remini", "hd", "hdr"];

module.exports = handler;

async function remini(imageData, operation) {
  return new Promise(async (resolve, reject) => {
    const availableOperations = ["enhance", "recolor", "dehaze"];
    if (!availableOperations.includes(operation)) {
      operation = availableOperations[0]; // Default ke 'enhance' jika operasi tidak valid
    }
    
    const baseUrl = `https://inferenceengine.vyro.ai/${operation}.vyro`;
    const formData = new FormData();
    formData.append("image", Buffer.from(imageData), {
      filename: "enhance_image_body.jpg",
      contentType: "image/jpeg"
    });
    
    formData.append("model_version", 1, {
      "Content-Transfer-Encoding": "binary",
      contentType: "multipart/form-data; charset=utf-8"
    });
    
    formData.submit({
      url: baseUrl,
      host: "inferenceengine.vyro.ai",
      path: `/${operation}`,
      protocol: "https:",
      headers: {
        "User-Agent": "okhttp/4.9.3",
        Connection: "Keep-Alive",
        "Accept-Encoding": "gzip"
      }
    }, (err, res) => {
      if (err) return reject(err);
      
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", err => reject(err));
    });
  });
}