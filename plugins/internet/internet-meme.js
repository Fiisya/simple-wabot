const handler = async (m, { conn, text, usedPrefix, command }) => {
  const page = Math.floor(Math.random() * 10);
  const url = `https://lahelu.com/api/post/get-search?query=${text || "jomok"}&page=${page}`;
  m.reply(wait);
  try {
    const response = await fetch(url);
    const data = await response.json();
    const random = Math.floor(Math.random() * data.postInfos.length);
    const result = data.postInfos[random];
    const message = `*====[ MEME FROM LAHELU ]====*
*Title:* ${result.title}
*Total Upvotes:* ${result.totalUpvotes}
*Total Downvotes:* ${result.totalDownvotes}
*Total Comments:* ${result.totalComments}
*Create Time:* ${new Date(result.createTime).toLocaleString()}
*Media:* ${result.media}
*Sensitive:* ${result.sensitive ? "✅" : "❌"}
*User Username:* ${result.userUsername}
*====[ MEME FROM LAHELU ]====*`;
    await conn.sendFile(
      m.chat,
      result.media,
      "",
      message,
      m,
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    conn.reply(m.chat, "❌ Terjadi kesalahan saat mengambil data", m);
  }
};
handler.help = ["meme"].map((a) => a + " *[random meme]*");
handler.tags = ["internet"];
handler.command = ["lahelu", "meme"];

module.exports = handler;
