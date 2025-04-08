let { Scraper, Uploader } = require("akiraa-scrape");
let fs = require("fs");
let fetch = require("node-fetch");
let moment = require("moment-timezone");
let cp = require("child_process");
let { promisify } = require("util");

let handler = (m) => m;
handler.all = async function (m) {
  let name = await conn.getName(m.sender);
  let pp = global.thumb;
  try {
    pp = await this.profilePictureUrl(m.sender, "image");
  } catch (e) {
  } finally {
    global.rose =
      "J8rLad2TXRKdqfVC3ToqxJy5zEqmtzI3b5y6yjzC1IIYAXl7hfhWoxtU9siJ4GU6";
    global.btc = "Lio";
    global.doc = pickRandom([
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/pdf",
    ]);
    global.fetch = require("node-fetch");
    global.Scraper = new Scraper();
    global.Func = new (require(process.cwd() + "/lib/func"))();
    // global.botdate = b.tanggal(new Date());
    global.axios = require("axios");
    global.Uploader = Uploader;
    global.cheerio = require("cheerio");

    const _uptime = process.uptime() * 1000;

    global.fkontak = {
      key: {
        remoteJid: "0@s.whatsapp.net",
        participant: "0@s.whatsapp.net",
        id: "",
      },
      message: {
        conversation: `*© Simple Base Botz*`,
      },
    };
  }
  global.tanggal = async (numer) => {
    const myMonths = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const myDays = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jum'at",
      "Sabtu",
    ];

    const tgl = new Date(numer);
    const day = tgl.getDate();
    const bulan = tgl.getMonth();
    const thisDay = tgl.getDay();
    const thisDayName = myDays[thisDay];
    const yy = tgl.getYear();
    const year = yy < 1000 ? yy + 1900 : yy;
    const time = require("moment").tz("Asia/Jakarta").format("DD/MM HH:mm:ss");
    const d = new Date();
    const locale = "id";
    const gmt = new Date(0).getTime() - new Date("1 January 1970").getTime();
    const weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
      Math.floor((d * 1 + gmt) / 84600000) % 5
    ];

    return `${thisDayName}, ${day} - ${myMonths[bulan]} - ${year}`;
  };
  //return a(new Date());
  global.exec = promisify(cp.exec).bind(cp);
  global.fakestatus = (txt) => {
    return {
      key: {
        remoteJid: "0@s.whatsapp.net",
        participant: "0@s.whatsapp.net",
        id: "",
      },
      message: {
        conversation: txt,
      },
    };
  };
};

module.exports = handler;

function ucapan() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  let res = "malam Sek";
  if (time >= 4) {
    res = "Selamat pagi 🌅";
  }
  if (time > 10) {
    res = "Selamat siang kak ⛅";
  }
  if (time >= 15) {
    res = "selamat sore kak 🌄";
  }
  if (time >= 18) {
    res = "selamat malam kak 🌌";
  }
  return res;
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}
