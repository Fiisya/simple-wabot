/*─────────────────────────────────────────
  lib/serialize.js – ayanaMD by KennDev
  Serialize pesan Baileys v7 menjadi object
  yang mudah dipakai di plugin
─────────────────────────────────────────*/

import {
  jidDecode,
  jidNormalizedUser,
  areJidsSameUser,
  extractMessageContent,
  downloadContentFromMessage,
  proto,
  WAMessageStubType,
  generateWAMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  getContentType,
} from '@whiskeysockets/baileys';
import { toAudio, toPTT, toVideo } from './converter.js';
import { fileTypeFromBuffer } from 'file-type';
import { tmpdir } from 'os';
import path from 'path';
import fs from 'fs';

/* ─── helpers ─────────────────────────── */
const isNumber     = (x) => typeof x === 'number' && !isNaN(x);
const delay        = (ms) => isNumber(ms) && new Promise((r) => setTimeout(r, ms));
const cleanNumber  = (str) => str?.replace(/[^0-9]/g, '');

function decodeJid(jid) {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    const dec = jidDecode(jid) || {};
    return (dec.user && dec.server && `${dec.user}@${dec.server}`) || jid;
  }
  return jidNormalizedUser(jid);
}

function getContentTypeMsg(message) {
  if (!message) return undefined;
  const keys = Object.keys(message);
  const key  = keys.find((k) => k !== 'senderKeyDistributionMessage' && k !== 'messageContextInfo');
  return key;
}

/* ─── smsg ────────────────────────────── */
export function smsg(conn, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;

  if (m.message?.viewOnceMessageV2) m.message = m.message.viewOnceMessageV2.message;
  if (m.message?.documentWithCaptionMessage) m.message = m.message.documentWithCaptionMessage.message;
  if (m.message?.viewOnceMessageV2Extension) m.message = m.message.viewOnceMessageV2Extension.message;

  m.conn    = conn;
  m.id      = m.key.id;
  m.isBaileys = m.id?.startsWith('3EBO') || m.id?.startsWith('BAE5') || false;
  m.chat    = decodeJid(m.key.remoteJid) || '';
  m.fromMe  = m.key.fromMe;
  m.isGroup = m.chat.endsWith('@g.us');
  
  // FIX: Gunakan participantAlt/remoteJidAlt (JID) sebelum participant/remoteJid (LID)
  const senderSource = m.fromMe
    ? conn.user?.id
    : m.isGroup
      ? (m.key.participantAlt || m.key.participant)
      : (m.key.remoteJidAlt || m.key.remoteJid);
  m.sender = decodeJid(senderSource) || '';

  m.mtype = getContentTypeMsg(m.message) || '';
  const msgContent = m.message?.[m.mtype] || {};
  m.msg    = extractMessageContent(m.message) || {};
  m.body   = m.message?.conversation || msgContent?.text || msgContent?.caption || (m.mtype === 'listResponseMessage' ? msgContent?.singleSelectReply?.selectedRowId : '') || (m.mtype === 'buttonsResponseMessage' ? msgContent?.selectedButtonId : '') || (m.mtype === 'templateButtonReplyMessage' ? msgContent?.selectedId : '') || '';
  m.text   = m.body;
  m.name = m.pushName || m.sender.split('@')[0];
  m.mentionedJid = msgContent?.contextInfo?.mentionedJid || [];

  m.mediaType = ['imageMessage','videoMessage','audioMessage','stickerMessage','documentMessage'].includes(m.mtype) ? m.mtype : null;
  m.download = (pathFile) => downloadMedia(m, pathFile);

  const ctx = msgContent?.contextInfo;
  if (ctx?.quotedMessage) {
    const quoted = ctx.quotedMessage;
    m.quoted = {};
    m.quoted.key = { fromMe: areJidsSameUser(ctx.participant, conn.user?.id), participant: ctx.participant, remoteJid: m.chat, id: ctx.stanzaId };
    m.quoted.id = ctx.stanzaId;
    m.quoted.chat = m.chat;
    m.quoted.fromMe = m.quoted.key.fromMe;
    m.quoted.sender = decodeJid(ctx.participant) || '';
    m.quoted.message = quoted;
    m.quoted.mtype = getContentTypeMsg(quoted) || '';
    const qContent = quoted[m.quoted.mtype] || {};
    m.quoted.body = quoted?.conversation || qContent?.text || qContent?.caption || '';
    m.quoted.text = m.quoted.body;
    m.quoted.mediaType = ['imageMessage','videoMessage','audioMessage','stickerMessage','documentMessage'].includes(m.quoted.mtype) ? m.quoted.mtype : null;
    m.quoted.download = (pathFile) => downloadMedia(m.quoted, pathFile);
    m.quoted.name = m.quoted.sender.split('@')[0];
    m.quoted.delete = () => conn.sendMessage(m.chat, { delete: m.quoted.key });
  } else { m.quoted = null; }

  m.reply = (text, options = {}) => conn.sendMessage(m.chat, { text: String(text), ...options }, { quoted: m });
  m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
  m.delete = () => conn.sendMessage(m.chat, { delete: m.key });

  m.copyNForward = async (jid, forceForward = false, opts = {}) => {
    const content = generateForwardMessageContent(m, forceForward);
    const msg = generateWAMessageFromContent(jid, content, { userJid: conn.user?.id, ...opts });
    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
    return msg;
  };

  return m;
}

/* ─── download media ──────────────────── */
async function downloadMedia(msg, pathFile) {
  if (!msg.mediaType) throw new Error('Bukan pesan media');
  const stream = await downloadContentFromMessage(msg.message[msg.mediaType], msg.mediaType.replace('Message', ''));
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  if (pathFile) { fs.writeFileSync(pathFile, buffer); return pathFile; }
  return buffer;
}

/* ─── conn extensions ─────────────────── */
export function bindConnMethods(conn, store) {
  conn.decodeJid = decodeJid;

  // Global map untuk menyimpan mapping LID -> nomor asli
  global.lidMap = global.lidMap || new Map();

  // Method untuk normalisasi JID dari participant (penting untuk deteksi admin)
  conn.getJid = (sender) => {
    let jid = conn.decodeJid(sender);
    if (!jid?.endsWith('@lid')) return jid;
    
    // Cek cache lidMap dulu
    if (global.lidMap.has(jid)) return global.lidMap.get(jid);
    
    // Cari di semua group participants
    for (const chatJid of Object.keys(store?.groupMetadata || {})) {
      try {
        const meta = store.groupMetadata[chatJid] || {};
        const p = meta.participants?.find((u) => u.id === jid || u.lid === jid);
        if (p?.phoneNumber || p?.id) {
          const result = conn.decodeJid(p.phoneNumber || p.id);
          if (!result.endsWith('@lid')) {
            global.lidMap.set(jid, result);
            return result;
          }
        }
      } catch {}
    }
    
    // Cari di contacts
    for (const [contactJid, contact] of Object.entries(store?.contacts || {})) {
      if (contact?.lid === jid || contact.id === jid) {
        const phoneNumber = contact.phoneNumber || contact.notify || contact.name;
        if (phoneNumber && !phoneNumber.endsWith('@lid')) {
          const result = phoneNumber.includes('@') ? phoneNumber : phoneNumber + '@s.whatsapp.net';
          global.lidMap.set(jid, result);
          return result;
        }
      }
    }
    
    return jid;
  };

  conn.getName = async (jid, withoutContact = false) => {
    jid = decodeJid(jid);
    if (!jid) return '';
    if (jid.endsWith('@g.us')) {
      try { return (await conn.groupMetadata(jid)).subject; }
      catch { return jid.split('@')[0]; }
    }
    
    // Cek store contacts dulu (cepat)
    const contact = store?.contacts?.[jid] || conn.chats?.[jid] || {};
    let name = contact.name || contact.notify || contact.vname || contact.pushName;
    if (name && !withoutContact) return name;

    // Fallback: Query ke server WA (onWhatsApp)
    // Di Baileys v7, onWhatsApp sering return 'lid' atau 'notify' jika ada
    try {
      const res = await conn.onWhatsApp(jid);
      if (res && res.length > 0) {
        // Cek field yang mungkin berisi nama
        const waName = res[0].notify || res[0].vname || res[0].name || res[0].lid;
        if (waName && !waName.endsWith('@lid')) return waName;
      }
    } catch (e) {
      console.log('[getName] onWhatsApp error:', e.message);
    }

    return jid.split('@')[0];
  };

  conn.sendText = (jid, text, quoted, opts = {}) => conn.sendMessage(jid, { text, ...opts }, { quoted });
  conn.reply = (jid, text, quoted, opts = {}) => conn.sendMessage(jid, { text: String(text), ...opts }, { quoted });
  conn.sendImage = (jid, buffer, caption = '', quoted, opts = {}) => conn.sendMessage(jid, { image: buffer, caption, ...opts }, { quoted });
  conn.sendVideo = (jid, buffer, caption = '', quoted, opts = {}) => conn.sendMessage(jid, { video: buffer, caption, ...opts }, { quoted });
  conn.sendAudio = (jid, buffer, quoted, opts = {}) => conn.sendMessage(jid, { audio: buffer, mimetype: 'audio/mpeg', ...opts }, { quoted });
  conn.sendPTT = (jid, buffer, quoted, opts = {}) => conn.sendMessage(jid, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true, ...opts }, { quoted });
  conn.sendSticker = (jid, buffer, quoted, opts = {}) => conn.sendMessage(jid, { sticker: buffer, ...opts }, { quoted });
  conn.sendDocument = (jid, buffer, mimetype, fileName, caption = '', quoted, opts = {}) => conn.sendMessage(jid, { document: buffer, mimetype, fileName, caption, ...opts }, { quoted });

  conn.sendContact = (jid, contacts, quoted, opts = {}) => {
    const list = (Array.isArray(contacts) ? contacts : [contacts]).map((c) => ({
      displayName: c.name || c.number,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${c.name || c.number};;;\nFN:${c.name || c.number}\nitem1.TEL;waid=${c.number}:+${c.number}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
    }));
    return conn.sendMessage(jid, { contacts: { displayName: list[0].displayName, contacts: list }, ...opts }, { quoted });
  };

  conn.sendButton = async (jid, buttons, quoted, opts = {}) => {
    const btns = buttons.map(([text, id]) => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: text, id }) }));
    return conn.sendMessage(jid, { text: opts.body || '', footer: opts.footer || global.wm, buttons: btns, ...opts }, { quoted });
  };

  conn.delay = delay;

  conn.pushMessage = async (messages) => {
    if (!Array.isArray(messages)) messages = [messages];
    
    // Pastikan conn.chats ada
    if (!conn.chats) conn.chats = {};

    for (const m of messages) {
      if (!m?.key?.remoteJid) continue;
      
      // FIX: Gunakan participantAlt (JID) jika ada, bukan participant (LID)
      // Ini kunci agar cache nama tersimpan dengan kunci JID yang benar
      const isGroup = m.key.remoteJid.endsWith('@g.us');
      let rawJid = m.key.fromMe 
        ? conn.user?.id 
        : (isGroup ? (m.key.participantAlt || m.key.participant) : m.key.remoteJid);
      
      if (m.pushName || m.verifiedName) {
        // Normalisasi ID final
        let id = decodeJid(rawJid);

        // Simpan ke store.contacts
        if (store?.contacts) {
          store.contacts[id] = {
            ...(store.contacts[id] || {}),
            id: id,
            name: m.pushName || store.contacts[id]?.name,
            notify: m.pushName || store.contacts[id]?.notify,
            vname: m.verifiedName || store.contacts[id]?.vname,
          };
        }

        // Simpan ke conn.chats (penting untuk getName)
        conn.chats[id] = {
          ...(conn.chats[id] || {}),
          id: id,
          name: m.pushName || conn.chats[id]?.name,
          notify: m.pushName || conn.chats[id]?.notify,
        };
      }

      // Simpan pesan ke store
      if (store) {
        store.messages ||= {};
        if (!store.messages[m.key.remoteJid]) store.messages[m.key.remoteJid] = {};
        store.messages[m.key.remoteJid].array ||= [];
        store.messages[m.key.remoteJid].array.push(m);
      }
    }
  };

  return conn;
}
