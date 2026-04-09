import { WAMessageStubType } from '@whiskeysockets/baileys';

const handler = async function (m, { conn }) {};

handler.all = async function (m) {
  if (
    m.messageStubType === WAMessageStubType.CALL_MISSED_VOICE ||
    m.messageStubType === WAMessageStubType.CALL_MISSED_VIDEO
  ) {
    await this.reply(m.chat, '❌ Bot tidak menerima panggilan. Anda akan diblokir.', null);
    await this.delay(1000);
    await this.updateBlockStatus(m.sender, 'block');
  }
};

export default handler;
