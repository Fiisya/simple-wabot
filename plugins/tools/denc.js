const { Deobfuscator } = require("deobfuscator");

module.exports = {
  code: async (m, { args, command, usedPrefix }) => {
    const usage = `*• Example :* ${usedPrefix}${command} *[input/reply code]*`;
    let text;
    if (args.length >= 1) {
      text = args.join(" ");
    } else {
      if (!m.quoted || !m.quoted?.text) return m.reply(usage);
      text = m.quoted?.text;
    }

    const message = await Decrypt(text);
    m.reply(message);
  },

  help: ["dencrypt"].map((a) => a + " *[input/reply code]*"),
  tags: ["tools"],
  command: ["denc", "dencrypt"],
};

async function Decrypt(query) {
  return new Deobfuscator().deobfuscateSource(query);
}
