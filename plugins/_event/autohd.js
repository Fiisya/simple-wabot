let handler = async function (m, { args }) {
  const chat = global.db.data.chats[m.chat] || {};
  const arg = (args[0] || '').toLowerCase();

  if (arg === 'on') {
    chat.autohd = true;
    m.reply('✅ AutoHD telah *diaktifkan* di chat ini.');
  } else if (arg === 'off') {
    chat.autohd = false;
    m.reply('❌ AutoHD telah *dinonaktifkan* di chat ini.');
  } else {
    m.reply('Format salah! Gunakan: .autohd on atau .autohd off');
  }

  global.db.data.chats[m.chat] = chat;
};
handler.command = ['autohd'];
handler.tags = ['ai'];
handler.help = ['autohd [on/off]'];
handler.register = true;

module.exports = handler;