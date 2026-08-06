const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  delay
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const moment = require("moment");
const cheerio = require("cheerio");
const imageToBase64 = require('image-to-base64');
const axios = require("axios");
const speed = require('performance-now');
const fs = require("fs");
const fetch = require('node-fetch');

// Setting Constants
const apivhtear = 'apikey';
const apibarbar = 'apikey';
const tobzkey = 'apikey';
const BotName = 'Lexa';
const wa = 'https://chat.whatsapp.com/FQNUK5VFD68GZaB0UlXjst';
const eror = 'Info fitur Error';
const ow = 'Mrf.zvx';
const nomorowner = '082223014661';
const pulsa = '082223014661';
const dana = '082223014661';
const ovo = '082223014661';

const vcard = 'BEGIN:VCARD\n'
  + 'VERSION:3.0\n'
  + 'FN:Mrf.zvx\n'
  + 'ORG:Lexa;\n'
  + 'TEL;type=CELL;type=VOICE;waid=6282223014661:+62 822-2301-4661\n'
  + 'END:VCARD';

async function startBot() {
  // Menggunakan authentication state modern berbasis multi-file
  const { state, saveCreds } = await useMultiFileAuthState('session_baileys');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  // Event listener untuk menyimpan kredensial
  conn.ev.on('creds.update', saveCreds);

  // Connection Handler
  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log(`[ ${moment().format("HH:mm:ss")} ] Scan QR Code di atas!`);
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Koneksi terputus. Menghubungkan kembali:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log(`[ ${moment().format("HH:mm:ss")} ] ${BotName} Siap Digunakan!`);
    }
  });

  // Log interval sederhana
  setInterval(() => {
    console.log(`[ ${moment().format("HH:mm:ss")} ] => HI! I'm ${BotName} :)`);
  }, 15000);

  // Event Listener untuk Pesan Masuk
  conn.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const id = msg.key.remoteJid;
      const isGroup = id.endsWith('@g.us');
      const sender = isGroup ? (msg.key.participant || msg.participant) : id;
      
      // Ekstraksi teks dari berbagai tipe pesan
      const messageContent = msg.message;
      const messageType = Object.keys(messageContent)[0];
      const text = messageContent.conversation || 
                   messageContent.extendedTextMessage?.text || 
                   messageContent.imageMessage?.caption || "";

      const groupMetadata = isGroup ? await conn.groupMetadata(id).catch(() => null) : null;
      const groupName = isGroup && groupMetadata ? groupMetadata.subject : '';
      const desk = isGroup && groupMetadata ? groupMetadata.desc : '';

      console.log(`[ ${moment().format("HH:mm:ss")} ] => Nomor: [ ${id.split("@")[0]} ] => ${text}`);

      // Helper untuk mempermudah kirim teks & balasan
      const reply = async (txt) => {
        return await conn.sendMessage(id, { text: txt }, { quoted: msg });
      };

      // Helper untuk kirim gambar
      const sendImage = async (bufferOrUrl, captionText = '') => {
        let imageBuffer;
        if (typeof bufferOrUrl === 'string' && bufferOrUrl.startsWith('http')) {
          const res = await axios.get(bufferOrUrl, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(res.data);
        } else if (typeof bufferOrUrl === 'string') {
          imageBuffer = Buffer.from(bufferOrUrl, 'base64');
        } else {
          imageBuffer = bufferOrUrl;
        }

        return await conn.sendMessage(id, {
          image: imageBuffer,
          caption: captionText
        }, { quoted: msg });
      };

      // --- COMMAND HANDLERS ---

      // Fitur Rules
      if (text.includes(".rules")) {
        let idgrup = `*${groupName}*\n*Rules* : \n${desk}`;
        await reply(idgrup);
      }

      // Link Group
      if (text.includes(".linkgc") && isGroup) {
        const linkgc = await conn.groupInviteCode(id);
        const hasil = `Grup : ${groupName}\n*Link* : https://chat.whatsapp.com/${linkgc}`;
        await reply(hasil);
      }

      // Cek Nomor
      if (text.includes(".cek")) {
        var num = text.replace(/.cek/, "").trim();
        var idn = num.replace("0", "62") + '@s.whatsapp.net';
        const [exists] = await conn.onWhatsApp(idn);
        await reply(`${num} ${exists?.exists ? "terdaftar" : "tidak terdaftar"} di WhatsApp`);
      }

      // Bucin
      if (text.includes('.Seberapabucin')) {
        await reply('Silakan ulangi command dengan huruf kecil');
      }
      if (text.includes(".seberapabucin")) {
        axios.get(`https://arugaz.herokuapp.com/api/howbucins`).then(async (res) => {
          let hasil = `*Bucin Detected*\n*Persentase* : ${res.data.persen}% \n_${res.data.desc}_`;
          await reply(hasil);
        }).catch(() => reply(eror));
      }

      // Bug report
      if (text.includes('.bug')) {
        const teks = text.replace(/.bug /, "");
        let hasil1 = `Info Bug *${teks}* Berhasil dikirimkan ke Owner`;
        await reply(hasil1);
        await conn.sendMessage(`${nomorowner}@s.whatsapp.net`, {
          text: `*>Report* : ${sender.split("@")[0]} | ${id}\n*>Reason* : ${teks}`,
          mentions: [sender]
        });
      }

      // Fix bug
      if (text.includes('.fixbug')) {
        var porn = text.split(".fixbug ")[1];
        var text1 = porn.split("/")[0];
        var text2 = porn.split("/")[1];
        let hasil = `*Owner* : *Mrf.zvx*\n*>Pesan* : ${text2}`;
        await conn.sendMessage(`${text1}@s.whatsapp.net`, { text: hasil });
      }

      // Kerang Ajaib
      if (text.includes('.apakah')) {
        const teks = text.replace(/.apakah /, '');
        const truth = ['Iya', 'Tidak', 'Bisa Jadi', 'Coba tanyakan lagi', 'Mungkin', '🤐'];
        const ttrth = truth[Math.floor(Math.random() * truth.length)];
        await reply(`Pertanyaan : *${teks}*\n\nJawaban : ${ttrth}`);
      }

      // Ping Latensi
      if (text === '.ping') {
        const timestamp = speed();
        const latensi = speed() - timestamp;
        await reply(`PONG!!\n_Speed : ${latensi.toFixed(4)} Second_`);
      }

      // Owner Info
      if (text === '.owner') {
        await conn.sendMessage(id, {
          contacts: {
            displayName: "Mrf.zvx",
            contacts: [{ vcard }]
          }
        }, { quoted: msg });
      }

      // Donasi
      if (text.includes('.donasi')) {
        await reply(`Bantu donasi agar bot bisa terus berjalan.

اتَّقوا النَّارَ ولو بشقِّ تمرةٍ ، فمن لم يجِدْ فبكلمةٍ طيِّبةٍ
_“jauhilah api neraka, walau hanya dengan bersedekah sebiji kurma (sedikit). Jika kamu tidak punya, maka bisa dengan kalimah thayyibah” [HR. Bukhari 6539, Muslim 1016]_

*Pulsa :* _${pulsa}_
*Dana :* _${dana}_
*OVO :* _${ovo}_`);
      }

      // Tagme
      if (text.includes('.tagme')) {
        await conn.sendMessage(id, {
          text: `@${sender.split("@")[0]} Hai kak 🤗`,
          mentions: [sender]
        }, { quoted: msg });
      }

      // Open/Close Group Settings
      if (text === '.opengc' && isGroup) {
        await conn.groupSettingUpdate(id, 'not_announcement');
        await reply("Grup telah dibuka untuk seluruh anggota.");
      }
      if (text === '.closegc' && isGroup) {
        await conn.groupSettingUpdate(id, 'announcement');
        await reply("Grup telah ditutup, hanya admin yang dapat mengirim pesan.");
      }

      // Set Group Name / Desc
      if (text.includes(".setname") && isGroup) {
        const teks = text.replace(/.setname /, "");
        await conn.groupUpdateSubject(id, teks);
        await reply('Mengganti Nama Group...');
      }
      if (text.includes(".setdesc") && isGroup) {
        const teks = text.replace(/.setdesc /, "");
        await conn.groupUpdateDescription(id, teks);
        await reply('Mengganti deskripsi grup...');
      }

      // Random Photo Fetcher (Image Search)
      if (text.includes(".img")) {
        var teks = text.replace(/.img /, "");
        var url = "https://api.fdci.se/rep.php?gambar=" + encodeURIComponent(teks);

        axios.get(url).then(async (result) => {
          var n = result.data;
          if (n && n.length > 0) {
            var nimek = n[Math.floor(Math.random() * n.length)];
            await reply('[ WAIT ] Searching image... ⏳ silahkan tunggu');
            await sendImage(nimek, `Hasil pencarian: ${teks}`);
          } else {
            await reply('Gambar tidak ditemukan.');
          }
        }).catch(() => reply(eror));
      }

    } catch (err) {
      console.error("Error penanganan pesan:", err);
    }
  });
}

// Jalankan Bot
startBot();
            
