let handler = async (
  m,
  { isAdmin, isOwner, isBotAdmin, conn, args, usedPrefix, command },
) => {
  let chat = global.db.data.chats[m.chat];
  let prefix = usedPrefix;
  let bu = `*[ ✓ ] Success turned on anti link on this group*`.trim();

  let isClose = {
    on: true,
    off: false,
  }[args[0] || ""];
  if (isClose === undefined) {
    var text5 = `*[ ${command.toUpperCase()} EXAMPLE ]*:
> *• Example :* ${usedPrefix + command} on
> *• Example :* ${usedPrefix + command} off`;
    conn.sendButton(
      m.chat,
      [
        ["🟢 TURN ON", `${usedPrefix + command} on`],
        ["🔴 TURN OFF", `${usedPrefix + command} off`],
      ],
      {
        body: text5,
      },
    );

    throw false;
  } else if (isClose === false) {
    chat.antiBot = isClose;
    await m.reply("*[ ✓ ] Successfully turned off anti link on this group*");
  } else if (isClose === true) {
    chat.antiBot = isClose;
    await m.reply(bu);
  } else if (isClose === undefined) {
    var te = `*[ ${command.toUpperCase()} EXAMPLE ]*:
> *• Example :* ${usedPrefix + command} on
> *• Example :* ${usedPrefix + command} off`;

    conn.sendButton(
      m.chat,
      [
        ["🟢 TURN ON", `${usedPrefix + command} on`],
        ["🔴 TURN OFF", `${usedPrefix + command} off`],
      ],
      {
        body: te,
      },
    );
  }
};

handler.help = ["antibot *[on/off]*"];
handler.tags = ["group"];
handler.command = ["antibot"];
handler.group = true;
handler.admin = true;
handler.botAdmin = false;

module.exports = handler;
