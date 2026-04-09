import { alfisy } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} data analyst | jakarta`);

  await m.reply(global.wait);

  try {
    let job = text;
    let city = '';

    if (text.includes('|')) {
      const parts = text.split('|').map(p => p.trim());
      job = parts[0];
      city = parts[1] || '';
    }

    if (!job) {
      return m.reply('❌ Posisi pekerjaan tidak boleh kosong.');
    }

    const result = await alfisy('/api/tools/jobstreet', { job, city });

    if (!result || !result.status) {
      return m.reply('❌ Gagal mencari lowongan kerja.');
    }

    const jobs = result.result || [];

    if (jobs.length === 0) {
      return m.reply(`❌ Tidak ada lowongan untuk *${job}* di *${city || 'semua kota'}*.`);
    }

    let replyText = `┌─⭓「 *JOB STREET* 」\n│\n│ 💼 *Posisi:* ${job}\n│ 🌍 *Kota:* ${city || 'Semua Kota'}\n│ 📊 *Total:* ${jobs.length} lowongan\n│\n`;

    jobs.slice(0, 10).forEach((j, i) => {
      const company = j.companyName || j.employer?.name || j.advertiser?.description || 'Unknown';
      const title = j.title || 'Unknown';
      const location = j.locations?.[0]?.label || j.locations?.[0]?.seoHierarchy?.[0]?.contextualName || '-';
      const date = j.listingDateDisplay || '-';
      const workType = j.workTypes?.join(', ') || '-';
      const salary = j.salaryLabel || 'Negotiable';
      const url = j.jobUrl || `https://id.jobstreet.com/job-${j.id}`;

      replyText += `│ *${i + 1}. ${title}*\n`;
      replyText += `│ 🏢 *Company:* ${company}\n`;
      replyText += `│ 📍 *Location:* ${location}\n`;
      replyText += `│ 💰 *Salary:* ${salary}\n`;
      replyText += `│ ⏰ *Type:* ${workType}\n`;
      replyText += `│ 📅 *Posted:* ${date}\n`;
      replyText += `│ 🔗 ${url}\n│\n`;
    });

    replyText += `└───────────────⭓\n> ${global.wm}`;

    await m.reply(replyText);

  } catch (e) {
    console.error('[JobStreet Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['jobstreet <posisi> | <kota>'];
handler.tags = ['tools'];
handler.command = /^(jobstreet|job|loker|lowongan)$/i;
handler.limit = 1;

export default handler;
