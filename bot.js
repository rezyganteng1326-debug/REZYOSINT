const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const moment = require("moment");
const readline = require("readline");

// Modul Readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const BotName = 'Lexa';

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session_baileys');
  const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, // <-- WAJIB set ke false agar QR tidak otomatis muncul!
    logger: require('pino')({ level: 'silent' })
  });
  
  conn.ev.on('creds.update', saveCreds);

  // LOGIKA LOGIN PILIHAN
  if (!conn.authState.creds.registered) {
    console.log("\n========================================");
    console.log("       PILIH METODE LOGIN WHATSAPP      ");
    console.log("========================================");
    console.log("1. Scan QR Code");
    console.log("2. Pairing Code (Nomor Telepon)");
    
    const pilihan = await question("\nMasukkan pilihan (1/2): ");

    if (pilihan.trim() === "2") {
      let phoneNumber = await question("\nMasukkan nomor WA Bot (Contoh: 6282223014661): ");
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

      setTimeout(async () => {
        let code = await conn.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(`\n========================================`);
        console.log(`KODE PAIRING KAMU : ${code}`);
        console.log(`========================================\n`);
      }, 3000);

    } else {
      console.log("\n[!] Menampilkan QR Code...");
      conn.ev.on('connection.update', (update) => {
        const { qr } = update;
        if (qr) {
          qrcode.generate(qr, { small: true });
        }
      });
    }
  }

  // CONNECTION HANDLER TUNGGAL
  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log(`\n[ ${moment().format("HH:mm:ss")} ] ${BotName} Berhasil Terhubung!`);
    }
  });

  // (LETAKKAN conn.ev.on('messages.upsert', ...) MILIKMU DI BAWAH SINI)

  // ===================================================
  // SAMPAI DI SINI! (Di bawah ini adalah conn.ev.on('messages.upsert') bawaan kamu)
  // ===================================================

  conn.ev.on('messages.upsert', async (m) => {
    // ... isi fitur bot kamu (.rules, .seberapabucin, dll)
  });
}
             
  + 'END:VCARD';

  // Menggunakan authentication state modern berbasis multi-file
  const { state, saveCreds } = await useMultiFileAuthState('session_baileys');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: require("pino")({ level: "silent" })
});

  // Event listener untuk menyimpan kredensial
  if (!conn.authState.creds.registered) {
    console.log("\n========================================");
    console.log("       PILIH METODE LOGIN WHATSAPP");
    console.log("========================================");
    console.log("1. Scan QR Code");
    console.log("2. Pairing Code (Nomor Telepon)");

    const pilihan = await question("\nMasukkan pilihan (1/2): ");

    if (pilihan.trim() === "2") {
        let phoneNumber = await question("Masukkan nomor WA (628xxxx): ");
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

        setTimeout(async () => {
            try {
                let code = await conn.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;

                console.log("\n========================================");
                console.log("PAIRING CODE : " + code);
                console.log("========================================\n");
            } catch (e) {
                console.log("Gagal membuat Pairing Code:", e.message);
            }
        }, 3000);
    }
  }

  const pilihan = await question("Pilih (1/2): ");

  if (pilihan.trim() === "2") {
    let phoneNumber = await question("Masukkan nomor WA: ");
    phoneNumber = phoneNumber.replace(/\D/g, "");

    const code = await conn.requestPairingCode(phoneNumber);
    console.log("Pairing Code:", code.match(/.{1,4}/g).join("-"));
  } else {
    conn.ev.on("connection.update", ({ qr }) => {
      if (qr) qrcode.generate(qr, { small: true });
    });
  }
  }
  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr && conn.authState.creds.registered) {
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
            
