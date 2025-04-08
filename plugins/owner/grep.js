const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);
const handler = async (m, { conn, args, usedPrefix, command }) => {
  const text =
    args.join(" ") ||
    m.quoted?.text ||
    m.quoted?.caption ||
    m.quoted?.description;
  if (!text)
    return m.reply(`*• Example :* ${usedPrefix + command} *[Input text]*`);
  const folderPath = "./";
  const commandStr = `grep -rnw '${folderPath}' -e '${text}' --include='*.js' --exclude-dir='node_modules' --color=never`;
  m.reply(wait);
  try {
    const { stdout, stderr } = await execPromise(commandStr);
    if (stderr) throw new Error(stderr);
    const lines = stdout.split("\n").filter(Boolean);
    if (lines.length === 0) {
      await m.reply("No matches found.");
      return;
    }
    const resultsText = lines
      .map((line, index) => {
        const match = line.match(/^(.*?):(\d+):(.+)$/);
        if (!match)
          return `*• GREP RESULT ${index + 1} :*\n\n• *Content:* \`${line.trim()}\``;
        const [, path, lineNum, content] = match;
        return `*• result :* ${index + 1}\n\n*• Line :* ${lineNum}\n*• Content:* \`${content.trim()}\`\n*• Path:* ${path}`;
      })
      .join("\n________________________\n");
    const resultMessage = `*• Request :* ${text}

${resultsText}\n\n*• Total Result :* ${lines.length}\n`;
    m.reply(resultMessage);
  } catch (e) {}
};
handler.help = ["grep"].map((a) => a + " *[input text]*");
handler.tags = ["owner"];
handler.command = /^(grep)$/i;
handler.owner = true;

module.exports = handler;
