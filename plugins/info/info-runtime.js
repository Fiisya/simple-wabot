let handler = async (m, { conn, text, usedPrefix, command }) => {
  m.reply(
    `*[ INFO RUNTIME BOT ]*\n> • *Bot  Runtime:* ${await Func.toDate(process.uptime() * 1000)}\n> • *Os Runtime:* ${await Func.toDate(require("os").uptime() * 1000)}`,
    `https://og.tailgraph.com/og?fontFamily=Poppins&title=Runtime+Bot&titleTailwind=font-bold%20text-red-600%20text-7xl&stroke=true&text=Time : ${Func.toTime(process.uptime() * 1000)}&textTailwind=text-red-700%20mt-4%20text-2xl&textFontFamily=Poppins&logoTailwind=h-8&bgUrl=https%3A%2F%2Fwallpaper.dog%2Flarge%2F272766.jpg&bgTailwind=bg-white%20bg-opacity-30&footer=©+AkiraaBot+2023-2024&footerTailwind=text-grey-600`,
  );
};
handler.help = ["runtime"].map((a) => a + " *[Runtime bot]*");
handler.tags = ["info"];
handler.command = ["runtime", "uptime"];
module.exports = handler;
