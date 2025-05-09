module.exports = {
  before: async (m, { conn }) => {
    if (m.isBaileys || !m.message || !m.message.editedMessage) return;
    const editedMsg = m.message.editedMessage;
    if (
      editedMsg.imageMessage ||
      editedMsg.videoMessage ||
      editedMsg.documentMessage ||
      (editedMsg.editedMessage &&
        (editedMsg.editedMessage.imageMessage ||
          editedMsg.editedMessage.videoMessage ||
          editedMsg.editedMessage.documentMessage))
    ) {
      return;
    }
    await conn.appendTextMessage(
      m,
      editedMsg.message?.protocolMessage?.editedMessage?.extendedTextMessage
        ?.text || editedMsg.extendedTextMessage?.text,
      m.chatUpdate,
    );
  },
};
