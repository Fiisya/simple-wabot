const os = require("os");
const {
    spawn,
    exec,
    execSync
} = require("child_process");

module.exports = {
    help: ["os"].map(a => a + " *[os info]*"),
    tags: ["info"],
    command: ["os"],
    code: async (m, {
        conn,
        usedPrefix,
        command,
        text,
        isOwner,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate
    }) => {
        let timestamp = Date.now();
        let latensi = Date.now() - timestamp;
        exec(`neofetch --stdout`, (error, stdout, stderr, json) => {
            let child = stdout.toString("utf-8");
            let ssd =
                child.replace(/Memory:/, "Ram:");
            m.reply(`• *CPU:* ${ssd}*Kecepatan* : ${latensi.toFixed(4)} _ms_\n• *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem / 1024 / 1024)}MB\n• *OS:* ${os.version()}\n• *Platform:* ${os.platform()}\n• *Hostname:* ${os.hostname()}`);
        });
    }
}