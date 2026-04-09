const handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender];
  if (user.registered) return m.reply('Kamu sudah terdaftar!');

  if (!args[0]) return m.reply('Format: .daftar nama.umur\nContoh: .daftar Budi.20');
  const [nama, umurStr] = args[0].split('.');
  const umur = parseInt(umurStr);
  if (!nama || isNaN(umur)) return m.reply('Format salah! Contoh: .daftar Budi.20');
  if (umur < 5 || umur > 100) return m.reply('Umur tidak valid (5-100)!');

  user.registered = true;
  user.name       = nama;
  user.age        = umur;
  user.regTime    = Date.now();

  await m.reply(`✅ *Registrasi Berhasil!*\n\n*Nama :* ${nama}\n*Umur :* ${umur} tahun\n\n> ${global.wm}`);
};
handler.help     = ['daftar nama.umur'];
handler.tags     = ['info'];
handler.command  = /^(daftar|register|reg)$/i;
handler.register = false;
export default handler;
