//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : info/ci


module.exports = {
    help: ['cekidch'],
    command: ['cekidch', 'ci'],
    tags: ['saluran'],
    code: async (m, {
        conn,
        text
    }) => {
        // Pastikan text berisi link channel WhatsApp
        if (!/whatsapp\.com\/channel\//.test(text)) throw '⚠️ Mana Link Channel-nya!';

        let id = text.replace(/https:\/\/whatsapp\.com\/channel\//gi, "");

        await conn.newsletterMetadata('invite', id).then(async (a) => {
            // Mengirimkan tombol untuk menyalin ID channel tanpa text
            await conn.sendCopy(m.chat, [
                ["Salin IDCH", `${a.id}`]
            ], m, {
                body: `𒁍⛶  \`Cek Newsletter\`
🔖Name: ${a.name || ''}
🧩Id: ${a.id || ''}
👥Subscribe: ${a.subscribers || ''}
🔗Link: ${'https://whatsapp.com/channel/' + a.invite || ''}
⏰Date: ${new Date(a.creation_time * 1000).toLocaleString()}`
            });
        });
    },
};