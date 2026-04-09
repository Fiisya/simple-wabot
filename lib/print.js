/*─────────────────────────────────────────
  lib/print.js – ayanaMD by KennDev
  Logger pesan ke terminal
─────────────────────────────────────────*/

import chalk from 'chalk';
import moment from 'moment-timezone';

export default function printMsg(m, conn = {}) {
  try {
    const type = m.isGroup ? 'Group' : 'Private';
    const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss');
    const sender = m.sender?.split('@')[0] || '';
    const name = m.name || sender;
    const chatName = m.isGroup ? (conn.chats?.[m.chat]?.name || m.chat.split('@')[0]) : m.chat;
    const txt = m.text ? m.text : '';
    const cmd = m.plugin ? chalk.magenta(`[${m.plugin.split('/').pop()}]`) : '';

    // File size calculation
    let filesize = (m.msg
      ? m.msg.vcard
        ? m.msg.vcard.length
        : m.msg.fileLength
          ? m.msg.fileLength.low || m.msg.fileLength
          : m.text
            ? m.text.length
            : 0
      : m.text
        ? m.text.length
        : 0) || 0;

    let sizeFormatted = filesize === 0 
      ? '0' 
      : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1);
    let sizeUnit = ['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || '';

    // Message type
    let mtype = m.mtype
      ? m.mtype
          .replace(/message$/i, '')
          .replace('audio', m.msg?.ptt ? 'PTT' : 'audio')
          .replace(/^./, (v) => v.toUpperCase())
      : '';

    console.log(
      `\n▣ ${chalk.redBright('%s')}\n│⏰ ${chalk.black(chalk.bgYellow('%s'))}\n│📑 ${chalk.black(chalk.bgGreen('%s'))}\n│📊 ${chalk.magenta('%s [%s %sB]')}\n│📤 ${chalk.green('%s')}\n│📃 ${chalk.yellow('%s%s')}\n│📥 ${chalk.green('%s')}\n│💬 ${chalk.black(chalk.bgYellow('%s'))}\n▣──────···\n`.trim(),
      (conn.user?.name || 'ayanaMD') + ' ~' + (conn.user?.jid?.split('@')[0] || ''),
      time,
      m.messageStubType || '',
      filesize,
      sizeFormatted,
      sizeUnit,
      sender + ' ~' + name,
      m.exp || '?',
      '',
      chatName + (m.isGroup ? ' ~' + chatName : ''),
      mtype
    );

    // Print text message with markdown formatting
    if (typeof txt === 'string' && txt) {
      let log = txt.replace(/\u200e+/g, '');
      let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
      let mdFormat =
        (depth = 4) =>
        (_, type, text, monospace) => {
          let types = {
            _: 'italic',
            '*': 'bold',
            '~': 'strikethrough',
          };
          text = text || monospace;
          let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
          return formatted;
        };
      log = log.replace(mdRegex, mdFormat(4));
      if (m.mentionedJid) {
        for (let user of m.mentionedJid) {
          log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + (conn.contacts?.[user]?.name || user.split('@')[0])));
        }
      }
      console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);
    }

    // Additional media info
    if (/document/i.test(m.mtype)) {
      console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`);
    } else if (/contact/i.test(m.mtype)) {
      console.log(`👨 ${m.msg.displayName || ''}`);
    } else if (/audio/i.test(m.mtype)) {
      const duration = m.msg.seconds;
      console.log(
        `${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`
      );
    }

    console.log();
  } catch {}
}
