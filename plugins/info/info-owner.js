let moment = require("moment-timezone");
let PhoneNum = require("awesome-phonenumber");
let regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let nomor = global.owner;
  let array = [];
    for (let i of nomor) {
      let num = (await conn.onWhatsApp(i))[0].jid;
      let img = await conn
        .profilePictureUrl(num, "image")
        .catch((_) => "https://telegra.ph/file/93c9aff7d28347b3ed2aa.png");
      let bio = await conn.fetchStatus(num).catch((_) => {});
      let name = await conn.getName(num);
      let format = PhoneNum(`+${num.split("@")[0]}`);
      let country = regionNames.of(format.getRegionCode("international"));

      let wea = `*[ This Owner ]*\n\n*° Country :* ${country.toUpperCase()}\n*° Name :* ${name ? name : "-"}\n*° Format Number :* ${format.getNumber("international")}\n*° Url Api :* wa.me/${num.split("@")[0]}\n*° Status :* ${bio?.status || "-"}\n*° Date Status :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale("id").format("LL") : "-"}`;

      array.push([
        wea,
        null,
        img,
        [],
        null,
        [["CHAT ME", `https://wa.me/${num.split("@")[0]}?text=Hallo+Kontol`]],
      ]);
    }

    conn.sendCarousel(m.chat, array, m, {
      body: `*[ MY CREATOR ]*
${global.owner.map((a, i) => `*${i + 1}.* @` + a + " *[" + " " + conn.getName(a + "@s.whatsapp.net") + "]*").join("\n")}

`,
    });
};

handler.help = ["owner"].map((a) => a + " *[Contact Owner]*");
handler.tags = ["info"];
handler.command = ["owner", "creator"];

module.exports = handler;
