let fs = require('fs'), 
    fetch = require('node-fetch'), 
    moment = require('moment-timezone');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    let response = await fetch('https://api.github.com/repos/Fiisya/simple-wabot');
    let repoData = await response.json();

    let repoMessage = '乂  *B O T - S C R I P T*\n\n';
    repoMessage += '┌  ◦  *Name* : ' + repoData.name + '\n';
    repoMessage += '│  ◦  *Visitor* : ' + repoData.watchers_count + '\n';
    repoMessage += '│  ◦  *Size* : ' + (repoData.size / 1024).toFixed(2) + ' MB\n';
    repoMessage += '│  ◦  *Updated* : ' + moment(repoData.updated_at).format('DD/MM/YY - HH:mm:ss') + '\n';
    repoMessage += '│  ◦  *Created At* : ' + repoData.created_at + '\n';
    repoMessage += '│  ◦  *Stars* : ' + repoData.stargazers_count + '\n';
    repoMessage += '│  ◦  *Forks* : ' + repoData.forks + '\n';
    repoMessage += '└  ◦  *Url* : ' + repoData.html_url;

    let thanksMessage = '乂  *B I G - T H A N K S T O*\n\n';
    thanksMessage += '┌  ◦  _Whiskeysocket_\n';
    thanksMessage += '│  ◦  _Nurutomo_\n';
    thanksMessage += '│  ◦  _Wildan_\n';
    thanksMessage += '│  ◦  _*' + global.wm + '* -> ' + nomorown + '_\n';
    thanksMessage += '│  ◦  _Nazir_\n';
    thanksMessage += '└  ◦  _BochilGaming_\n\n';
    thanksMessage += '' + global.wm;

    conn.sendMessage(m.chat, {
        text: repoMessage + '\n\n' + thanksMessage,
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: namebot,
                thumbnailUrl: 'https://telegra.ph/file/ac299e01e76c911d7f25a.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

};

handler.help = ['sc'];
handler.tags = ['info'];
handler.command = /^(sc|sourcecode)$/i;
handler.register = false;

module.exports = handler;
