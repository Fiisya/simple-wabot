const moment = require("moment-timezone");

module.exports = {
    help: ["buyprem"],
    tags: ["info"],
    command: ["buyprem"],
    code: async (
        m, {
            conn,
            usedPrefix,
            command,
            text,
            isOwner,
            isAdmin,
            isBotAdmin,
            isPrems,
            chatUpdate,
        },
    ) => {
        conn.buyprem = conn.buyprem ? conn.buyprem : {};

        const packages = [{
                price: 1000,
                name: "PREMIUM 1D",
                expired: 1,
            },
            {
                price: 7000,
                name: "PREMIUM 7D",
                expired: 7,
            },
            {
                price: 30000,
                name: "PREMIUM 30D",
                expired: 30,
            },
        ];

        const user = db.data.users[m.sender];
        const saldo = `*• Your Saldo :* ${Func.formatNumber(user.saldo)}`;

        const packageList = packages
            .map(
                (package, i) => `*┌──⭓「 ${package.name} 」*
*│* *• Package :* ${i + 1}
*│* *• Price :* ${Func.formatNumber(package.price)}
*│* *• Expired :* ${package.expired}D
*└───────⭓*
`,
            )
            .join("\n");

        const example = `*• Example :* ${usedPrefix + command} *[number package]*
${saldo}

${packageList}`;

        if (!text) {
            const array = packages.map((package, i) => ({
                title: package.name,
                body: `*• Price :* ${Func.formatNumber(package.price)}`,
                command: `${usedPrefix + command} ${i + 1}`,
            }));
            const selection = [{
                rows: array,
            }, ];
            return conn.sendList(
                m.chat,
                "P R E M I U M",
                selection,
                fakestatus("*[ Buy Premium ]*"), {
                    body: example,
                    footer: `© Create by @${conn.user.jid.split("@")[0]}`,
                },
            );
        }
        if (conn.buyprem[m.sender]) {
            if (text === "y") {
                let data = conn.buyprem[m.sender]
                if (user.saldo < data.price) {
                    let cap = `*+ B U Y - P R E M I U M*
    
*• Name :* ${data.data.name}
*• Price :* ${Func.formatNumber(data.price)} *[ Biaya admin ]*
*• Expired :* ${data.currentDate} *[ ${data.data.expired} ]*

Saldo anda *[ ${Func.formatNumber(user.saldo)} ]* tidak cukup
apakah anda ingin mengisi saldo ?`
                    conn.sendButton(m.chat, [
                        ["D E P O S I T", `.deposit ${data.price} nq`],
                        ["C A N C E L", `${usedPrefix  + command} n`]
                    ], m, {
                        body: cap
                    })
                    delete conn.buyprem[m.sender]
                } else {
                    user.saldo -= parseInt(data.price)
                    user.premium = true
                    user.premiumDate = data.data.expired
                    let cap = `*+ B U Y - P R E M I U m*

*• Status :* Activate!
*• Name :* ${data.data.name}
*• Price :* ${Func.formatNumber(data.price)} *[ Biaya admin ]*
*• Expired :* ${data.expired} *[ ${data.data.expired} ]*

Pembelian premium berhasil
Total saldo kamu saat ini : *[ ${Func.formatNumber(user.saldo)} ]*`
                    conn.sendButton(m.chat, [
                        ["P R O F I L E", ".profile"]
                    ], fakestatus("*[ Premium active! ]*"), {
                        body: cap
                    })
                    delete conn.buyprem[m.sender]
                }
            } else if (text === "n") {
                let data = conn.buyprem[m.sender]
                let cap = `*+ B U Y - P R E M I U M*

*• Status :* cancelled
*• Name :* ${data.data.name}
*• Price :* ${Func.formatNumber(harga)} *[ Biaya admin ]*
*• Expired :* ${data.expired} *[ ${data.data.expired} ]*

Pembelian premium dibatalkan`
                conn.sendButton(m.chat, [
                    ["B U Y - P R E M", usedPrefix + command]
                ], fakestatus("*[ Premium cancelled! ]*"), {
                    body: cap
                })
                delete conn.buyprem[m.sender]
            }
        } else {
            const select = packages[text - 1];
            const harga = select.price + parseInt(100);
            const currentDate = moment()
                .tz("Asia/Jakarta")
                .add(select.expired, "days")
                .format("DD/MM/YYYY HH:mm");
            const orderID = "PREMBOT-" + Func.makeId(25);
            const cap = `*B U Y - P R E M I U M*
    
*• Status :* Waiting
*• Name :* ${select.name}
*• Price :* ${Func.formatNumber(harga)} *[ Biaya admin ]*
*• Expired :* ${currentDate} *[ ${select.expired}D ]*

Ketik *Y* untuk melanjutkan pembayaran 
ketik *N* untuk membatalkan pembayaran`;
            conn.sendList(
                m.chat,
                "S E L E C T - O N E",
                [{
                    rows: [{
                            title: "C O N F I R M",
                            command: `${usedPrefix + command} y`,
                        },
                        {
                            title: "C A N C E L",
                            command: `${usedPrefix + command} n`,
                        },
                    ],
                }, ],
                fakestatus("*[ order confirmation ]*"), {
                    body: cap,
                    footer: `Request order by : @${m.sender.split("@")[0]}`,
                },
            );

            conn.buyprem[m.sender] = {
                id: orderID,
                status: false,
                jid: m.sender,
                price: harga,
                expired: currentDate,
                data: select,
            };
        }
    }
}