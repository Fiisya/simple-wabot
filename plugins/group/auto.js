//Simple Base Botz
// • Credits : wa.me/62895322391225 [ Asyl ]
// • Feature : group/auto


const moment = require('moment-timezone');
const schedule = require('node-schedule');

const timeZone = 'Asia/Jakarta';
const closeTime = '21:00';
const openTime = '03:00';
const closeWarningTime = '20:50';
const openWarningTime = '02:50';

const groupChats = ['120363189162607817@g.us']

let groupStatus = {};
let warningStatus = {};

const checkGroupStatus = async (conn) => {
    const currentTime = moment().tz(timeZone).format('HH:mm');

    for (const groupChat of groupChats) {
        if (currentTime === closeWarningTime && !warningStatus[`${groupChat}-close`]) {
            await conn.sendMessage(groupChat, {
                text: '⚠️ *Grup akan ditutup 10 menit lagi.*\nGunakan kesempatan terakhir untuk chat.'
            });
            warningStatus[`${groupChat}-close`] = true;
        }

        if (currentTime === closeTime && groupStatus[groupChat] !== 'closed') {
            await conn.groupSettingUpdate(groupChat, 'announcement');
            await conn.sendMessage(groupChat, {
                text: '📴 *Grup telah ditutup.*\nMohon tunggu 6 jam lagi untuk dibuka kembali.'
            });
            groupStatus[groupChat] = 'closed';
            warningStatus[`${groupChat}-close`] = false;
        }

        if (currentTime === openWarningTime && !warningStatus[`${groupChat}-open`]) {
            await conn.sendMessage(groupChat, {
                text: '⚠️ *Grup akan dibuka kembali 10 menit lagi.*\nSiapkan pesan kalian!'
            });
            warningStatus[`${groupChat}-open`] = true;
        }

        if (currentTime === openTime && groupStatus[groupChat] !== 'opened') {
            await conn.groupSettingUpdate(groupChat, 'not_announcement');
            await conn.sendMessage(groupChat, {
                text: '🔓 *Grup telah dibuka kembali.*\nSilakan gunakan kembali, dan ingat, jangan spam ya🫵'
            });
            groupStatus[groupChat] = 'opened';
            warningStatus[`${groupChat}-open`] = false;
        }
    }
};

schedule.scheduleJob('* * * * *', () => {
    checkGroupStatus(global.conn);
});

module.exports = {
    checkGroupStatus
};