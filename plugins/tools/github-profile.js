import { alfisy, downloadFile } from '../../lib/api.js';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`┌─⭓「 *GITHUB PROFILE* 」\n│\n│ Cek profil GitHub user\n│\n│ Contoh:\n│ ${usedPrefix + command} Fiisya\n│ ${usedPrefix + command} torvalds\n└───────────────⭓`);
  }

  await m.reply(global.wait);

  try {
    const result = await alfisy('/api/tools/github-profile', { username: text });

    if (!result || !result.success) {
      return m.reply('❌ Gagal mengambil info profile. Pastikan username benar.');
    }

    const profile = result.profile || result.result;
    const repos = result.repos || profile?.repos || [];
    const followers = result.followers?.length || profile?.followers_count || 0;
    const following = result.following?.length || profile?.following_count || 0;

    const createdDate = new Date(profile.created_at).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const replyText = `┌─⭓「 *GITHUB PROFILE* 」\n│\n│ 👤 *Name:* ${profile.name || profile.login}\n│ 📛 *Username:* @${profile.login}\n│ 📝 *Bio:* ${profile.bio || '-'}\n│ 🏢 *Company:* ${profile.company || '-'}\n│ 🌍 *Location:* ${profile.location || '-'}\n│ 🔗 *Blog:* ${profile.blog || '-'}\n│\n│ 📊 *Public Repos:* ${profile.public_repos || 0}\n│ 👥 *Followers:* ${followers}\n│ ➡️ *Following:* ${following}\n│ ⭐ *Gists:* ${profile.public_gists || 0}\n│ 📅 *Joined:* ${createdDate}\n│\n└───────────────⭓\n> ${global.wm}`;

    // Download avatar
    const avatarUrl = profile.avatar_url;
    if (avatarUrl) {
      try {
        const buffer = await downloadFile(avatarUrl);
        
        await conn.sendMessage(m.chat, {
          image: buffer,
          caption: replyText,
        }, { quoted: m });
        return;
      } catch (e) {
        console.log('[Avatar download failed]');
      }
    }

    await m.reply(replyText);

  } catch (e) {
    console.error('[GitHub Profile Error]', e);
    await m.reply(`❌ Terjadi error: ${e.message}`);
  }
};

handler.help = ['githubprofile <username>'];
handler.tags = ['tools'];
handler.command = /^(githubprofile|ghprofile|ghp)$/i;
handler.limit = 1;

export default handler;
