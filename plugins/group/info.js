//© AkiraaBot 2023-2024
// • Credits : wa.me/6287869975929 [ Bang syaii ]
// • Owner: 6287869975929,6283831945469,6287869976118,6283133703175

/*
• untuk siapa pun yang ketahuan menjual script ini tanpa sepengetahuan developer mohon untuk dilaporkan !
*/

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command,
    groupMetadata
}) => {
    let data = store.groupMetadata[m.chat];
    let pp;
    try {
        pp = await conn.profilePictureUrl(m.chat, "image");
    } catch (e) {
        pp = thumb;
    }
    let cap = `*[ GROUP INFOMATION ]*
*• ID :* *[ ${data.id} ]*
*• Subject :* ${data.subject}
*• Total Member :* ${data.size}
*•  Accept New member :* ${data.joinApprovalMode ? "[ ✓ ]" : "[ x ]"}
*• Add Others Member :* ${data.memberAddMode ? "[ ✓ ]" : "[ x ]"}
*• Message Restrict :*  ${data.restrict ? "[ ✓ ]" : "[ x ]"}

${data.desc}
`;
    await conn.sendMessage(
        m.chat, {
            image: {
                url: pp,
            },
            caption: cap,
            mentions: await conn.parseMention(cap),
        }, {
            quoted: m
        },
    );
};
handler.help = ["infogroup"].map((a) => a + " *[get Info group]*");
handler.tags = ["group"];
handler.command = ["infogroup"];
handler.group = true;

module.exports = handler;