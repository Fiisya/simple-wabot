//© AkiraaBot 2023-2024
// • Credits : wa.me/6287869975929 [ Bang syaii ]
// • Owner: 6283831945469,6287869975929

/*
• untuk siapa pun yang ketahuan menjual script ini tanpa sepengetahuan developer mohon untuk dilaporkan !
*/

const JavaScriptObfuscator = require("javascript-obfuscator");

let handler = async (m, { text, usedPrefix, command }) => {
  if (!m.quoted) throw `*• Example :* ${usedPrefix + command} *[reply code]*`;
  const message = await Encrypt(m.quoted.text);
  return m.reply(message);
};
handler.help = ["encrypt"].map((a) => a + " *[reply code]*");
handler.tags = ["tools"];
handler.command = ["enc", "encrypt"];
handler.limit = true;
module.exports = handler;

async function Encrypt(query) {
  const obfuscationResult = JavaScriptObfuscator.obfuscate(query);
  let encryptedCode = obfuscationResult.getObfuscatedCode();
  return encryptedCode;
}

async function Decrypt(encryptedCode) {
  const decryptedCode =
    JavaScriptObfuscator.obfuscate(encryptedCode).getObfuscatedCode();

  return decryptedCode;
}
