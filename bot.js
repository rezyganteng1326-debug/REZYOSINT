const qrcode = require("qrcode-terminal");
const moment = require("moment");
const cheerio = require("cheerio");
const imageToBase64 = require('image-to-base64');
const get = require('got');
const fs = require("fs");
const dl = require("./lib/downloadImage.js");
const fetch = require('node-fetch');
const urlencode = require("urlencode");
const axios = require("axios");
const speed = require('performance-now');

//Setting

const apivhtear = 'apikey';
const apibarbar = 'apikey';
const tobzkey = 'apikey';
const BotName = 'Lexa';
const wa = 'https://chat.whatsapp.com/FQNUK5VFD68GZaB0UlXjst';
const eror = 'Info fitur Error';
const ow = 'Mrf.zvx';
const nomorowner = '082223014661';
const ovo = '082223014661';
const pulsa = '082223014661';
const dana = '082223014661';
const instagram = 'http://www.instagram.com/mrf.zvx';
const aktif = '08:00 - 22:00';
const vcard = 'BEGIN:VCARD\n'
  + 'VERSION:3.0\n'
  + 'FN:Mrf.zvx\n' // Nama kamu
  + 'ORG:Lexa;\n' // Nama bot
  + 'TEL;type=CELL;type=VOICE;waid=6282223014661:+62 822-2301-4661\n' //Nomor whatsapp kamu
  + 'END:VCARD'
//
const
  {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    GroupSettingChange,
    mentionedJid,
    processTime,
  } = require("@adiwajshing/baileys");
var jam = moment().format("HH:mm");
// OCR Library

const readTextInImage = require('./lib/ocr'
)
function foreach(arr, func) {
  for (var i in arr) {
    func(i, arr[i]);
  }
}
const conn = new WAConnection()
conn.on('qr', qr => {
  qrcode.generate(qr,
    {
      small: true
    });
  console.log(`[ ${moment().format("HH:mm:ss")} ] Arelbot Ready scan now!`);
});

conn.on('credentials-updated', () => {
  // save credentials whenever updated
  console.log(`credentials updated$`)
  const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
  fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
})
fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json')
// uncomment the following line to proxy the connection; some random proxy I got off of: https://proxyscrape.com/free-proxy-list
//conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
conn.connect();


conn.on('message-status-update', json => {
  const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
})
setInterval(function () {
  for (i = 0; i < 3; i++) {
    console.log(`[ ${moment().format("HH:mm:ss")} ] => HI! I'm lexa :)`)
  }
}, 15000)

//function

conn.on('message-new', async (m) => {
  const messageContent = m.message
  const text = m.message.conversation
  let id = m.key.remoteJid
  const isGroup = id.endsWith('@g.us')
  const totalchat = await conn.chats.all()
  const sender = isGroup ? m.participant : m.key.remoteJid
  const groupMetadata = isGroup ? await conn.groupMetadata(id) : ''
  const groupName = isGroup ? groupMetadata.subject : ''
  const desk = isGroup ? groupMetadata.desc : ''
  const groupId = isGroup ? groupMetadata.jid : ''
  const groupMembers = isGroup ? groupMetadata.participants : ''
  const messageType = Object.keys(messageContent)[0] // message will always contain one key signifying what kind of message
  let imageMessage = m.message.imageMessage;
  console.log(`[ ${moment().format("HH:mm:ss")} ] => Nomor: [ ${id.split("@s.whatsapp.net")[0]} ] => ${text}`);


  //Fitur

  // Groups
  if (text.includes(".buatgrup")) {
    var nama = text.split(".buatgrup")[1].split("-nomor")[0];
    var nom = text.split("-nomor")[1];
    var numArray = nom.split(",");
    for (var i = 0; i < numArray.length; i++) {
      numArray[i] = numArray[i] + "@s.whatsapp.net";
    }
    var str = numArray.join("");
    console.log(str)
    const group = await conn.groupCreate(nama, str)
    console.log("created group with id: " + group.gid)
    conn.sendMessage(group.gid, "hello everyone", MessageType.extendedText) // say hello to everyone on the group

  }

  //Mengambil deskripsi grup
  if (text.includes(".rules")) {
    let idgrup = `*${groupName}*\n*Rules* : \n${desk}`;
    conn.sendMessage(id, idgrup, MessageType.text, { quoted: m });
  }

  //Mengambil link grup
  if (text.includes(".linkgc")) {
    const linkgc = await conn.groupInviteCode(id)
    const hasil = `Grup : ${groupName}\n*Link* : https://chat.whatsapp.com/${linkgc}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  }

  //Cek nomor
  if (text.includes(".cek")) {
    var num = text.replace(/.cek/, "")
    var idn = num.replace("0", "+62");

    console.log(id);
    const gg = idn + '@s.whatsapp.net'

    const exists = await conn.isOnWhatsApp(gg)
    console.log(exists);
    conn.sendMessage(id, `${gg} ${exists ? " exists " : " does not exist"} on WhatsApp`, MessageType.text)
  }

  //Seberapa bucin
  if (text.includes('.Seberapabucin')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  if (text.includes(".seberapabucin")) {
    const teks = text.replace(/.seberapabucin /, "")
    axios.get(`https://arugaz.herokuapp.com/api/howbucins`).then((res) => {
      let hasil = `*Bucin Detected*\n*Persentase* : ${res.data.persen}% \n_${res.data.desc}_ `;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }

  //Bug report
  if (text.includes('.bug')) {
    const teks = text.replace(/.bug /, "")
    var nomor = m.participant
    const options = {
      text: `*>Report* : ${nomor.split("@s.whatsapp.net")[0]} | ${id}\n*>Reason* : ${teks}`,
      contextInfo: { mentionedJid: [nomor] }
    }
    let hasil1 = `Info Bug *${teks}* Berhasil di kirimkan ke Owner`;
    conn.sendMessage(id, hasil1, MessageType.text, { quoted: m })
    conn.sendMessage(`${nomorowner}@s.whatsapp.net`, options, MessageType.text)
  }

  //Owner to report
  if (text.includes('.fixbug')) {
    var porn = text.split(".fixbug ")[1];
    var text1 = porn.split("/")[0];
    var text2 = porn.split("/")[1];
    let hasil = `*Owner* : *Mrf.zvx*\n*>Pesan* : ${text2}`;
    conn.sendMessage(`${text1}@s.whatsapp.net`, hasil, MessageType.text);

  }

  //kerang ajaib
  if (text.includes('.Apakah')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .apakah aku cantik_', MessageType.text, { quoted: m });
  }
  if (text.includes('.Bolehkah')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .bolehkah aku mencintai dia_', MessageType.text, { quoted: m });
  }
  if (text.includes('.Kapan')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .kapan aku kaya_', MessageType.text, { quoted: m });
  }
  if (text.includes('.apakah')) {
    const teks = text.replace(/./, '')
    const truth = [
      'Iya',
      'Tidak',
      'Bisa Jadi',
      'Coba tanyakan lagi',
      'Mungkin',
      '🤐']
    const ttrth = truth[Math.floor(Math.random() * truth.length)]
    conn.sendMessage(id, 'Pertanyaan : *' + teks + '*\n\nJawaban : ' + ttrth, MessageType.text, { quoted: m })
  }

  if (text.includes('.bolehkah')) {
    const teks = text.replace(/./, '')
    const truth = [
      'Boleh',
      'Tidak boleh',
      'Sangat di anjurkan',
      'Coba tanyakan lagi',
      'Tidak',
      'Mungkin',
      'Jangan',
      '🤐']
    const ttrth = truth[Math.floor(Math.random() * truth.length)]
    conn.sendMessage(id, 'Pertanyaan : *' + teks + '*\n\nJawaban : ' + ttrth, MessageType.text, { quoted: m })
  }


  if (text.includes('.kapan')) {
    const teks = text.replace(/./, '')
    const truth = [
      '1 Hari lagi',
      '2 hari lagi',
      '3 hari lagi',
      '4 hari lagi',
      '5 hari lagi',
      '6 hari lagi',
      '1 minggu lagi',
      '2 minggu lagi',
      '3 minggu lagi',
      '1 bulan lagi',
      '2 bulan lagi',
      '3 hari lagi',
      '4 bulan lagi',
      '5 bulan lagi',
      '6 hari lagi',
      '7 bulan lagi',
      '8 bulan lagi',
      '9 hari lagi',
      '10 bulan lagi',
      '11 bulan lagi',
      '1 tahun lagi',
      '2 tahun lagi',
      '3 tahun lagi',
      '4 tahun lagi',
      'Tidak akan',
      'Yakin bakal terjadi ?',
      'Aku meragukan nya',
      'Lusa',
      'Akhir bulan depan',
      'Awal bulan depan',
      'Tahun depan',
      'Bulan depan',
      'Sebentar lagi',
      '🤐']
    const ttrth = truth[Math.floor(Math.random() * truth.length)]
    conn.sendMessage(id, 'Pertanyaan : *' + teks + '*\n\nJawaban : ' + ttrth, MessageType.text, { quoted: m })
  }


  //Zodiak
  if (text.includes('.Zodiak')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .zodiak libra_', MessageType.text, { quoted: m });
  }
  if (text.includes(".zodiak")) {
    const teks = text.replace(/.zodiak /, "")
    axios.get(`https://api.vhtear.com/zodiak?query=${teks}&apikey=${apivhtear}`).then((res) => {
      let hasil = `*Zodiak* : ${res.data.result.zodiak}\n*Ramalan hari ini* :\n${res.data.result.ramalan}\n\n_${res.data.result.inspirasi}_`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }

  //Tebakgambar
  if (text.includes('.Tebakgambar')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  if (text.includes(".tebakgambar")) {
    axios.get(`https://api.vhtear.com/tebakgambar&apikey=${apivhtear}`).then((res) => {
      imageToBase64(res.data.result.soalImg)
        .then(
          (ress) => {
            conn.sendMessage(id, '[ WAIT ] Menulis ⏳ silahkan tunggu', MessageType.text, { quoted: m })
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
          })
    })
  }

  //Familly100
  if (text.includes('.Family100')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  if (text.includes(".family100")) {
    axios.get(`https://api.vhtear.com/family100&apikey=${apivhtear}`).then((res) => {
      let hasil = `*Pertinyiinnyi* : ${res.data.result.soal}`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }

  //Artimimpi
  if (text.includes('.Mimpi')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .mimpi ular_', MessageType.text, { quoted: m });
  }
  if (text.includes(".mimpi")) {
    const teks = text.replace(/.mimpi /, "")
    axios.get(`https://api.vhtear.com/artimimpi?query=${teks}&apikey=${apivhtear}`).then((res) => {
      let hasil = `${res.data.result.hasil}`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }

  //Brainly 
  if (text.includes('.Brainly')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\ncontoh : .brainly apa itu makhluk hidup', MessageType.text, { quoted: m });
  }
  if (text.includes('.brainly')) {
    const teks = text.replace(/.brainly /, "")
    axios.get(`https://api.vhtear.com/branly?query=${teks}&apikey=${apivhtear}`).then((res) => {
      let hasil = ` ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ${res.data.result.data}`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }
  //How gay
  if (text.includes('.Seberapagay')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  if (text.includes(".seberapagay")) {
    const teks = text.replace(/.seberapagay /, "")
    axios.get(`https://arugaz.herokuapp.com/api/howgay`).then((res) => {
      let hasil = `*Gay Detected*\n*Persentase* : ${res.data.persen}%\n${res.data.desc}`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }

  //Info owner
  if (text.includes('.Owner')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  if (text.includes('.owner')) {
    conn.sendMessage(id, { displayname: "Jeff", vcard: vcard }, MessageType.contact, { quoted: m })
  }

  //Ganti nama grup
  if (text.includes('.Setname')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil, hanya berlaku jika bot menjadi admin', MessageType.text, { quoted: m });
  }
  if (text.includes(".setname")) {
    const teks = text.replace(/.setname /, "")
    let nama = `${teks}`;
    let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupUpdateSubject(idgrup, nama);
    conn.sendMessage(id, 'Mengganti Nama Group', MessageType.text, { quoted: m });

  }

  //Ganti deskripsi grup
  if (text.includes('.Setdesc')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil, hanya berlaku jika bot menjadi admin', MessageType.text, { quoted: m });
  }
  if (text.includes(".setdesc")) {
    const teks = text.replace(/.setdesc /, "")
    let desk = `${teks}`;
    let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupUpdateDescription(idgrup, desk)
    conn.sendMessage(id, 'Mengganti deskripsi grup', MessageType.text, { quoted: m });

  }

  //buka gc
  if (text.includes('.Opengc')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil, hanya berlaku jika bot menjadi admin', MessageType.text, { quoted: m });
  }
  else if (text == '.opengc') {
    let hasil = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupSettingChange(hasil, GroupSettingChange.messageSend, false);
    conn.sendMessage(id, MessageType.text);
  }

  //tutup gc
  if (text.includes('.Closegc')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil, hanya berlaku jika bot menjadi admin', MessageType.text, { quoted: m });

  }
  else if (text == '.closegc') {
    let hasil = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupSettingChange(hasil, GroupSettingChange.messageSend, true);
    conn.sendMessage(id, MessageType.text);
  }


  //Map
  if (text.includes('.Map')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil,\n_contoh : .map jakarta_', MessageType.text, { quoted: m });
  }
  if (text.includes('.map')) {
    var teks = text.replace(/.map /, '')
    axios.get('https://mnazria.herokuapp.com/api/maps?search=' + teks)
      .then((res) => {
        imageToBase64(res.data.gambar)
          .then(
            (ress) => {
              conn.sendMessage(id, '[WAIT] Searching  silakan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }


  //Donasi
  if (text.includes('.donasi')) {
    conn.sendMessage(id, `Bantu donasi agar bot bisa terus berjalan.

 اتَّقوا النَّارَ ولو بشقِّ تمرةٍ ، فمن لم يجِدْ فبكلمةٍ طيِّبةٍ
_“jauhilah api neraka, walau hanya dengan bersedekah sebiji kurma (sedikit). Jika kamu tidak punya, maka bisa dengan kalimah thayyibah” [HR. Bukhari 6539, Muslim 1016]_

*Pulsa :* _${pulsa}_
*Dana :* _${dana}_
*OVO :* _${ovo}_`, MessageType.text, { quoted: m });
  }

  //Informasi
  if (text.includes('.info')) {
    conn.sendMessage(id, 'Bot bermasalah ? laporkan fitur error ke owner, ketik .owner\nAtau gunakan fitur *.Bug*\n_Contoh : .bug fitur cerpen tidak bisa_', MessageType.text, { quoted: m });
  }

  //install
  if (text.includes('.install')) {
    var url = "https://user-images.githubusercontent.com/72728486/104588271-b4034e80-569a-11eb-8402-44bb2f2bd63b.jpg";
    axios.get(url).then((res) => {

      imageToBase64(url)

        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            let hasil = `How to install whatsapp bot on android\n\n*Tutorial* : https://github.com/mrfzvx12/termux-whatsapp-bot\n\n*Tutorial youtube* : https://youtu.be/VqSer_W1yvI`;
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m });
          })
    })
  }

  //intro grup
  if (text.includes('intro')) {
    conn.sendMessage(id,
      ────────────────
    Hai
    Selamat datang di
    ${groupName}
    Jangan lupa baca rules
    Ketik .Rules
      ────────────────

╔════════════════════
║──────〘  *Intro* 〙───────
╠════════════════════
╠≽️ *Nama*
╠≽️ *Umur*
╠≽️ *Asal Kota*
╠≽️ *Gender*
╠════════════════════
║──────── *Lexa* ──────── 
║  ▌│█║▌║▌║║▌║▌║█│▌▌│█║
║  ▌│█║▌║▌║║▌║▌║█│▌▌│█║
║──────── *Lexa* ────────
╠════════════════════
╠════════════════════` , MessageType.text);
  }

  //Tag
  if (text.includes('.Tagme')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  if (text.includes('.tagme')) {
    var nomor = m.participant
    const options = {
      text: `@${nomor.split("@s.whatsapp.net")[0]} Hai kak 🤗`,
      contextInfo: { mentionedJid: [nomor] }
    }
    conn.sendMessage(id, options, MessageType.text)
  }


  //notifikasi
  if (text.includes('!notif')) {
    const value = text.replace(/!notif /, '')
    var nomor = m.participant
    const group = await conn.groupMetadata(id)
    const member = group['participants']
    const ids = []
    member.map(async adm => {
      ids.push(adm.id.replace('c.us', 's.whatsapp.net'))
    })
    const options = {
      text: `Notif dari @${nomor.split("@s.whatsapp.net")[0]}\n*Pesan : ${value}*`,
      contextInfo: { mentionedJid: ids },
      quoted: m
    }
    conn.sendMessage(id, options, MessageType.text)
  }

  //Get ping
  if (text.includes('.Ping')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil', MessageType.text, { quoted: m });
  }
  else if (text == '.ping') {
    const timestamp = speed();
    const latensi = speed() - timestamp
    conn.sendMessage(id, `PONG!!\n_Speed : ${latensi.toFixed(4)} Second_`, MessageType.text, { quoted: m })
  }

  //Nulis dibuku
  if (text.includes('.Nulis')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .nulis Lexa love udan_', MessageType.text, { quoted: m });
  }
  //Pengucapan ulang
  if (text.includes('.Say')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .say Lexa gans_', MessageType.text, { quoted: m });
  }
  if (text.includes(".say")) {
    const teks = text.replace(/.say /, "")
    conn.sendMessage(id, teks, MessageType.text)
  }
  //Youtube download 
  if (text.includes('.Ytmp4')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .ytmp4 http://youtube..._', MessageType.text, { quoted: m });
  }
  if (text.includes('.ytmp4')) {
    const teks = text.replace(/.ytmp4 /, "")
    axios.get(`https://kocakz.herokuapp.com/api/media/ytvideo?url=${teks}`).then((res) => {
      imageToBase64(res.data.result.thumb)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Mendownload...⏳ silahkan tunggu', MessageType.text, { quoted: m })
            let hasil = `*Judul* : ${res.data.result.title}\n*Ukuran* : ${res.data.result.filesizeF}\n*Format* : MP4\n*Link* : ${res.data.result.dl_link}`;
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m });
          })
    })
  }

  if (text.includes('.yts')) {
    const teks = text.replace(/.yts /, "")
    axios.get(`https://docs-jojo.herokuapp.com/api/yt-play?q=${teks}`).then((res) => {
      imageToBase64(res.data.thumb)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Mendownload...⏳ silahkan tunggu', MessageType.text, { quoted: m })
            let hasil = `*Channel* : ${res.data.channel}\n*Judul* : ${res.data.title}\n*Durasi* : ${res.data.duration}\n*Ukuran* : ${res.data.filesize}\n*View* : ${res.data.total_view}\n*Format* : MP4\n*Link* : ${res.data.link}`;
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m });
          })
    })
  }

  if (text.includes('.Ytmp3')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .ytmp3 http://www.youtube..._', MessageType.text, { quoted: m });
  }
  if (text.includes('.ytmp3')) {
    const teks = text.replace(/.ytmp3 /, "")
    axios.get(`https://kocakz.herokuapp.com/api/media/ytaudio?url=${teks}`).then((res) => {
      imageToBase64(res.data.result.thumb)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Mendownload...⏳ silahkan tunggu', MessageType.text, { quoted: m })
            let hasil = `*Judul* : ${res.data.result.title}\n*Ukuran* : ${res.data.result.filesizeF}\n*Format* : MP3\n*Link* : ${res.data.result.dl_link}`;
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m });
          })
    })
  }

  //Instagram download
  if (text.includes('.Ig')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .ig http://www.instagram..._', MessageType.text, { quoted: m });
  }
  if (text.includes('.ig')) {
    const teks = text.replace(/.ig /, "")
    axios.get(`https://mhankbarbar.tech/api/ig?url=${teks}&apiKey=${apibarbar}`).then((res) => {
      conn.sendMessage(id, '[ WAIT ] Mendownload...⏳ silahkan tunggu', MessageType.text, { quoted: m })
      let hasil = `Klik link dan download hasilnya!\n*Link* : ${res.data.result}`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }


  //Tiktok download
  if (text.includes('.Tik')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .Tik https://www.tiktok..._', MessageType.text, { quoted: m });
  }
  if (text.includes('.tik')) {
    const teks = text.replace(/.tik /, "")
    axios.get(`https://kocakz.herokuapp.com/api/media/tiktok?url=${teks}`).then((res) => {
      conn.sendMessage(id, '[ WAIT ] Mendownload...⏳ silahkan tunggu', MessageType.text, { quoted: m })
      let hasil = `*Nama* : ${res.data.nameInfo}\n*Caption* : ${res.data.textInfo}\n*Waktu* : ${res.data.timeInfo}\n*Link* : ${res.data.mp4direct}`;
      conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
    })
  }

  //Facebook downloader
  if (text.includes('.Fb')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .fb https://www.facebook..._', MessageType.text, { quoted: m });
  }
  if (text.includes('.fb')) {
    const teks = text.replace(/.fb /, "")
    axios.get(`https://kocakz.herokuapp.com/api/media/facebook?url=${teks}`).then((res) => {

      conn.sendMessage(id, '[ WAIT ] Mendownload...⏳ silahkan tunggu', MessageType.text, { quoted: m })
      let hasil = `*Link* : ${res.data.linkHD}`;
      conn.sendMessage(id, buf, MessageType.text, { caption: hasil, quoted: m });
    })
  }

  //Text thunder
  if (text.includes('.Thunder')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .thunder Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.thunder')) {
    const teks = text.replace(/.thunder /, "")
    axios.get(`https://arugaz.my.id/api/textpro/thundertext?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/thundertext?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Sand1')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .sand1 Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.sand1')) {
    const teks = text.replace(/.sand1 /, "")
    axios.get(`https://arugaz.my.id/api/textpro/sandsummer?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/sandsummer?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Neon3d')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .neon3d Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.neon3d')) {
    const teks = text.replace(/.neon3d /, "")
    axios.get(`https://arugaz.my.id/api/textpro/text3d?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/text3d?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Blackpink')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .Blackpink Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.blackpink')) {
    const teks = text.replace(/.blackpink /, "")
    axios.get(`https://arugaz.my.id/api/textpro/blackpink?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/blackpink?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }


  if (text.includes('.Cloud')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .cloud Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.cloud')) {
    const teks = text.replace(/.cloud /, "")
    axios.get(`https://arugaz.my.id/api/textpro/realcloud?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/realcloud?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Sky')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .sky Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.sky')) {
    const teks = text.replace(/.sky /, "")
    axios.get(`https://arugaz.my.id/api/textpro/cloudsky?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/cloudsky?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Sand2')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .sand2 Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.sand2')) {
    const teks = text.replace(/.sand2 /, "")
    axios.get(`https://arugaz.my.id/api/textpro/sandwrite?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/sandwrite?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Sand3')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .sand3 Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.sand3')) {
    const teks = text.replace(/.sand3 /, "")
    axios.get(`https://arugaz.my.id/api/textpro/sandsummery?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/sandsummery?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Sand4')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .sand4 Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.sand4')) {
    const teks = text.replace(/.sand4 /, "")
    axios.get(`https://arugaz.my.id/api/textpro/sandengraved?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/sandengraved?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Balon')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .balon Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.balon')) {
    const teks = text.replace(/.balon /, "")
    axios.get(`https://arugaz.my.id/api/textpro/foilballoon?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/foilballoon?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Metal')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .metal Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.metal')) {
    const teks = text.replace(/.metal /, "")
    axios.get(`https://arugaz.my.id/api/textpro/metaldark?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/metaldark?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Old')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .old Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.old')) {
    const teks = text.replace(/.old /, "")
    axios.get(`https://arugaz.my.id/api/textpro/old1917?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/old1917?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Holo')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .holo Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.holo')) {
    const teks = text.replace(/.holo /, "")
    axios.get(`https://arugaz.my.id/api/textpro/holographic?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/holographic?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }



  if (text.includes('.Coding')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .coding Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.coding')) {
    const teks = text.replace(/.coding /, "")
    axios.get(`https://arugaz.my.id/api/textpro/matrixtext?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/matrixtext?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.tahta')) {
    var teks = text.replace(/.tahta /, "")
    axios.get(`https://api.vhtear.com/hartatahta?text=${teks}&apikey=${apivhtear}`)
      .then((res) => {
        imageToBase64(`https://api.vhtear.com/hartatahta?text=${teks}&apikey=${apivhtear}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.luxy')) {
    var teks = text.replace(/.luxy /, "")
    var url = "https://arugaz.my.id/api/textpro/luxury?text=" + teks;

    axios.get(url)
      .then((res) => {
        imageToBase64(url)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }


  if (text.includes('.Neon4')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .neon4 Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.neon4')) {
    const teks = text.replace(/.neon4 /, "")
    axios.get(`https://arugaz.my.id/api/textpro/bokehtext?text=${teks}`)
      .then((res) => {
        imageToBase64(res.data.url)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }

  if (text.includes('.Neon5')) {
    conn.sendMessage(id, 'Silakan ulangi command dengan huruf kecil\n_contoh : .neon5 Lexa_', MessageType.text, { quoted: m });
  }
  if (text.includes('.neon5')) {
    const teks = text.replace(/.neon5 /, "")
    axios.get(`https://arugaz.my.id/api/textpro/greenneon?text=${teks}`)
      .then((res) => {
        imageToBase64(`https://arugaz.my.id/api/textpro/greenneon?text=${teks}`)
          .then(
            (ress) => {
              conn.sendMessage(id, '[ WAIT ] Membuat teks⏳ silahkan tunggu', MessageType.text, { quoted: m })
              var buf = Buffer.from(ress, 'base64')
              conn.sendMessage(id, buf, MessageType.image, { quoted: m })
            })
      })
  }


  else if (text == '.kodebahasa') {
    conn.sendMessage(id, `Afrikaans = af
Albanian = sq
Amharic = am
Arabic = ar
Armenian = hy
Azerbaijani = az
Basque = eu
Belarusian = be
Bengali = bn
Bosnian = bs
Bulgarian = bg
Catalan = ca
Cebuano = ceb
Chinese (Simplified) = zh-CN
Chinese (Traditional) = zh-TW
Corsican = co
Croatian = hr
Czech = cs
Danish = da
Dutch = nl
English = en
Esperanto = eo
Estonian = et
Finnish = fi
French = fr
Frisian = fy
Galician = gl
Georgian = ka
German = de
Greek = el
Gujarati = gu
Haitian Creole = ht
Hausa = ha
Hawaiian = haw
Hebrew = he or iw
