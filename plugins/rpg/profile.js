//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : rpg/profile


let fetch = require("node-fetch");
let levelling = require('../../lib/levelling')

let handler = async (m, {
    conn,
    command
}) => {
    try {
        let who;
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
        else who = m.quoted.sender ? m.quoted.sender : m.sender;

        let ppUrl = await conn.profilePictureUrl(who, 'image').catch((_) => "https://cdn.jsdelivr.net/gh/SazumiVicky/MakeMeow-Storage@main/avatar_contact.png");
        let pp = await (await fetch(ppUrl)).buffer();

        let user = global.db.data.users[who];
        let username = user.name;
        let {
            min,
            xp,
            max
        } = levelling.xpRange(user.level, global.multiplier)
        let curr = user.exp - min
        let limit = user.premium ? '∞' : user.limit; // Mengubah limit user premium menjadi 'Infinity' jika pengguna adalah premium
        let balance = user.money > 9999999999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.money;
        let saldo = user.saldo; // Mengubah balance user yang lebih dari 999999999 menjadi 'Infinity'
        let level = user.level > 9999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.level; // Mengubah level pengguna yang lebih dari 9999 menjadi 'Infinity'
        let role = user.role;
        let skill = user.skill;
        let rank = user.owner ? 'Immortality' : user.premium ? 'Sepuh' : 'Kroco'; // Menambahkan 'Not Found' jika rank tidak terdefinisi
        let exp = user.exp > 999999999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.exp;
        let age = user.age > 4000 ? 'Unknown' : user.age;
        let isPremium = user.premium ? "Premium" : "Free User";
        let isVip = user.vip ? "Yes" : "Free User";
        let premiumExpired = user.premium ? new Date(user.premiumDate).toDateString() : "Not Found";
        let vipExpired = user.vip ? new Date(user.vipDate).toDateString() : "Not Found";
        let pasangan = user.pasangan ? global.db.data.users[user.pasangan].name : 'Not Have'; // Mengambil nama pasangan dari database
        let banned = user.banned ? true : false;
        let sahabat = user.sahabat ? '' + global.db.data.users[user.sahabat].name : 'Not Have';

        let caption = `
乂  *U S E R - P R O F I L E*

	◦ *Name* : ${username}
	◦ *Age* : ${age}
	◦ *Role* : ${role}
	◦ *Rank* : ${rank}
	◦ *Level* : ${level}
	◦ *Saldo* : ${formatRupiah(saldo)}
	◦ *Balance* : ${balance}
	◦ *Exp* : ${exp}
	◦ *Limit* : ${limit}

乂  *U S E R - S T A T U S*

	◦ *Banned* : ${banned ? 'Yes' : 'No'}
	◦ *Pasangan*: ${pasangan.split`@`[0]}
	◦ *Sahabat* : ${sahabat}
	◦ *Status* : ${isPremium}
	◦ *PremExpired* : ${premiumExpired}
  
       
    `.trim();
        conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'M y - P r o f i l e',
                    thumbnailUrl: ppUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        })
    } catch {
        let sender = m.sender;
        let ppUrl = await conn.profilePictureUrl(sender, 'image').catch((_) => "https://cdn.jsdelivr.net/gh/SazumiVicky/MakeMeow-Storage@main/avatar_contact.png");
        let pp = await (await fetch(ppUrl)).buffer();

        let user = global.db.data.users[sender];
        let username = user.name;
        let {
            min,
            xp,
            max
        } = levelling.xpRange(user.level, global.multiplier)
        let curr = user.exp - min
        let limit = user.premium ? '∞' : user.limit; // Mengubah limit user premium menjadi 'Infinity' jika pengguna adalah premium
        let balance = user.money > 9999999999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.money; // Mengubah balance user yang lebih dari 999999999 menjadi 'Infinity'
        let saldo = user.saldo;
        let level = user.level > 9999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.level; // Mengubah level pengguna yang lebih dari 9999 menjadi 'Infinity'
        let role = user.role;
        let skill = user.skill;
        let rank = user.owner ? 'Immortality' : user.premium ? 'Sepuh' : 'Kroco'; // Menambahkan 'Not Found' jika rank tidak terdefinisi
        let exp = user.exp > 999999999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.exp;
        let age = user.age > 4000 ? 'Unknown' : user.age;
        let isPremium = user.premium ? "Premium" : "Free User";
        let isVip = user.vip ? "Yes" : "Free User";
        let premiumExpired = user.premium ? new Date(user.premiumDate).toDateString() : "Not Found";
        let vipExpired = user.vip ? new Date(user.vipDate).toDateString() : "Not Found";
        let pasangan = user.pasangan ? global.db.data.users[user.pasangan].name : 'Not Have'; // Mengambil nama pasangan dari database
        let banned = user.banned ? true : false;
        let sahabat = user.sahabat ? '' + global.db.data.users[user.sahabat].name : 'Not Have';

        let caption = `
乂  *U S E R - P R O F I L E*

	◦ *Name* : ${username}
	◦ *Age* : ${age}
	◦ *Role* : ${role}
	◦ *Rank* : ${rank}
	◦ *Level* : ${level}
	◦ *Saldo* : ${balance}
	◦ *Exp* : ${exp}
	◦ *Limit* : ${limit}
  
乂  *U S E R - S T A T U S*

	◦ *Banned* : ${banned ? 'Yes' : 'No'}
	◦ *Pasangan*: ${pasangan.split`@`[0]}
	◦ *Status* : ${isPremium}
	◦ *PremExpired* : ${premiumExpired}

    `.trim();
        conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'M y - P r o f i l e',
                    thumbnailUrl: ppUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        })
    }
};

handler.command = /^(profile|me|my|profil)$/i
handler.help = ['profile *@user*'];
handler.tags = ['info'];
handler.register = true;

module.exports = handler;

function formatRupiah(number) {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });

    return formatter.format(number);
}