//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/group-totalmember.js


module.exports = {
    help: ["totalmem"].map((a) => a + " *[total member]*"),
    tags: ["group"],
    command: ["totalmem", "askot"],
    group: true,
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
        let PhoneNum = require("awesome-phonenumber");
        let regionNames = new Intl.DisplayNames(["en"], {
            type: "region",
        });

        let groupMetadata = await conn.groupMetadata(m.chat);
        if (!groupMetadata) return m.reply("Couldn't fetch group metadata");

        let participants = groupMetadata.participants;
        if (!participants) return m.reply("No participants found");

        let countryMembers = {};
        for (let participant of participants) {
            try {
                let phoneNumber = "+" + participant.id.split("@")[0];
                let phoneInfo = PhoneNum(phoneNumber);
                if (!phoneInfo.isValid()) continue;

                let regionCode = phoneInfo.getRegionCode();
                let country = regionNames.of(regionCode) || "Unknown";

                if (!countryMembers[country]) {
                    countryMembers[country] = [];
                }
                countryMembers[country].push(participant.id);
            } catch (e) {
                console.error("Error processing participant:", participant.id, e);
            }
        }

        let countryCounts = Object.keys(countryMembers).map((country) => ({
            name: country,
            total: countryMembers[country].length,
            jid: countryMembers[country],
        }));

        let totalSum = countryCounts.reduce(
            (acc, country) => acc + country.total,
            0,
        );
        let totalRegion = Object.keys(countryMembers).length;

        let hasil = countryCounts.map(({
            name,
            total,
            jid
        }) => ({
            name,
            total,
            jid,
            percentage: totalSum > 0 ? ((total / totalSum) * 100).toFixed(2) + "%" : "0%",
        }));

        let cap = `┌─⭓「 *TOTAL MEMBER* 」
│ *• Name :* ${groupMetadata.subject || "Unknown"}
│ *• Total :* ${participants.length}
│ *• Total Region :* ${totalRegion}
└───────────────⭓

┌─⭓「 *REGION MEMBER* 」
${hasil
  .sort((b, a) => a.total - b.total)
  .map(
    (a) => `│ *• Region :* ${a.name} *[ ${a.percentage} ]*
│ *• Total :* ${a.total} ${a.jid[0].startsWith("62") === true ? "" : `\n│ *• Jid :*\n${a.jid.map((i) => "│ @" + i.split("@")[0]).join("\n")}`}`,
  )
  .join("\n├───────────────⭓\n")}
└───────────────⭓`;

        conn.reply(m.chat, cap, fakestatus("*[ Total member ]*"));
    },
};