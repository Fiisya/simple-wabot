let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let id = Object.keys(conn.chats).filter(a => a.endsWith("@g.us"));
    let gc = conn.chats;
    let array = [];
    for (let i of id) {
        let name = await conn.getName(i);
        let data = gc[i].metadata;
        let chat = db.data.chats[i];
        array.push({
            name: name,
            id: i,
            member: data.size,
            owner: data.owner,
        });
    }

    let cap = array
        .map(
            (a, i) =>
            `*${i + 1}.* ${a.name}\n*• ID :* ${a.id}\n*• Total member :* ${a.member}\n*• Owner :* ${a.onwer ? `wa.me/${a.owner.split("@")[0]}` : "Nothing"}`,
        )
        .join("\n\n");

    m.reply(cap);
};
handler.help = ["listgc"].map((a) => a + " *[view all group join]*");
handler.tags = ["info"];
handler.command = ["listgc", "gcl"];
module.exports = handler;