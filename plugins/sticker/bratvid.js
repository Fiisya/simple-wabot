import axios from 'axios'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`┌─⭓「 *BRAT VIDEO* 」\n│\n│ Buat stiker video brat text\n│\n│ Contoh:\n│ ${usedPrefix + command} hai\n│ ${usedPrefix + command} halo hitam\n└───────────────⭓`);

  await m.reply(global.wait);

  let api = `https://brat.siputzx.my.id/mp4?text=${encodeURIComponent(text)}&background=%23ffffff&color=%23000000&emojiStyle=apple&delay=500&endDelay=1000&width=352&height=352`

  try {
    let response = await axios.get(api, { responseType: "arraybuffer", timeout: 30000 });
    let videoBuffer = Buffer.from(response.data)

    let tmpPath = join(tmpdir(), `${Date.now()}.mp4`)
    await writeFile(tmpPath, videoBuffer)

    let sticker = new Sticker(tmpPath, {
      type: StickerTypes.FULL,
      pack: global.packname || 'ayanaMD',
      author: global.author || 'KennDev',
      categories: ['🎥'],
      id: 'bratvid',
      quality: 70
    })

    let stickerBuffer = await sticker.toBuffer()

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

    await unlink(tmpPath)

  } catch (err) {
    console.error('[BratVid Error]', err)
    m.reply('❌ Gagal membuat stiker bratvid. Coba lagi nanti.')
  }
}

handler.help = ['bratvid <teks>']
handler.tags = ['sticker']
handler.command = /^bratvid$/i
handler.limit = 2

export default handler
