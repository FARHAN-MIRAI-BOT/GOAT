const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "captain",
    version: "2.0.0",
    author: "NAZRUL x MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "Sad video sender 😢",
    longDescription: "Sends random sad video with emotional captions 💔",
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    // 💔 Random sad captions
    const captions = [
      "=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n🐰🍒শী্ঁত্ঁ শী্ঁত্ঁ ভা্ঁব্ঁ কি্ঁসে্ঁর্ঁ জা্ঁনি্ঁ এ্ঁক্ঁটা্ঁ অ্ঁভা্ঁব্ঁ_🙊🙈\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷) ",
" === 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」 ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n--ღღ🦋🖤✨-\n\n--𝐋𝐨𝐯𝐞 𝐢'𝐬 𝐁𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥 __☺️🦋\n\n--𝐥𝐟 𝐭𝐡𝐞 𝐥𝐨𝐯𝐞𝐝 𝐨𝐧𝐞 𝐢𝐬 𝐫𝐢𝐠𝐡𝐭..!🦋🍁\n\n-ভালোবাসা সুন্দর ___,🖤🦋\n\n- যদি প্রিয় মানুষটি সঠিক হয়....!☺️🖤🙂\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷) ",
"___=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n❥◎⃝! শূন্যতায় ভাসি🙃 \n\n❥কখনো হাসি -😁💚_আবার কাঁদি!-😅\n\n❥বেলা শেষে 🌌শূন্যতায় জড়িয়ে ও পূর্ণতা খুঁজি😊❤\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍 (✷‿✷)",
"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n ❥»̶̶͓͓͓̽̽̽⑅⃝✺❥᭄❥\n\n___💚__পৃথিবীটা আজ...\n\nমিথ্যে মায়াতে ভরা...!💚🌺\n\n____🥀_তাই তো পৃথীবীর মানুষ আজ....!\n\nঅভিনয়ের সেরা...👎🥀\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",
"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n💜🔐 ___\n\n- 𝗧𝗵𝗶𝘀 𝗮𝗯𝗼𝘂𝘁 𝗹𝗶𝗻𝗲-!! 😽🧡\n\n🍁_সবাই তো খুশি চায়_আর আমি প্রতিটা খুশিতে তোমাকে চাই⚜️— -!!-) 😊🖤\n\n___💜🔐\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",
"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n>🐰✨𝑻𝒉𝒊𝒔 𝒍𝒊𝒏𝒆 𝒊𝒔 𝒇𝒐𝒓 𝒚𝒐𝒖🖤🌸\n\n___চোখের দেখায় নয়,মনের দেখায় ভালবাসি!!😇✨\n\n- কাছে থাকো কিংবা দূরে,তোমাকে ভেবেই হাসি!!🖤🐰\n\n💖🦋\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",
"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n:༅༎💙🦋\n༆𝐓𝐡𝐢𝐬 𝐚𝐛𝐨𝐮𝐭 𝐥𝐢𝐧𝐞_⚠︎🙅🏻‍♂️✨\n\n😽︵۵মানুষ! হচ্ছে!বৃষ্টির!মতো!Life a ! অনেক মানুষ !আসবে!অনেক মানুষ !যাবে!💔🥰\n\n:༅༎💙🦋 সঠিক!মানুষটা!ঠিকই!ছায়া!হয়ে!পাশে!থাকবে -/ ఌ︵💚🌻\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",
"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n:(-𝙄 𝙖𝙢 𝘼𝙙𝙙𝙞𝙘𝙩𝙚𝙙 𝙏𝙤👀🙈\n\n_')𝙈𝙮 𝙁𝙖𝙫𝙤𝙧𝙞𝙩𝙚 𝙋𝙚𝙧𝙨𝙤𝙣..!\n\n🐰🦋 -(^আমি আমার প্রিয় মানুষটার প্রতি আসক্ত >!💖🔐)\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",

"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n𝙗𝙚𝙡𝙞𝙚𝙫𝙚 𝙩𝙝𝙞𝙨 𝙡𝙞𝙣𝙚-!!🦋🐭\n\n🐰' —'পারফেক্ট' কাউকে পাবার থেকে'কাউকে' পারফেক্ট' বানিয়ে নিতে পারাটা' বড় অর্জন'--)🌼💜\n\n___🍒🖇️✨___\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",
"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n°🐹💙\n\n_𝗧𝗿𝘂𝘀𝘁 𝗺e 🔐💚\n°\n\n__!!✨🌺আপনাকে পাওয়ার দাবি!আমি মৃত্যুর পরও ছাড়বো না,,🔐💚\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)",

"=== 「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」  ===\n  --❖-- 𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓(✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n__𝗥𝗶𝗴𝗵𝘁 𝗽𝗲𝗼𝗽𝗹𝗲 𝗮𝗿𝗲 𝗮𝗹𝘄𝗮𝘆𝗲𝘀 𝗮𝗻𝗴𝗿𝘆 𝗯𝗲𝗰𝗮𝘂𝘀𝗲 𝘁𝗵𝗲𝘆 𝗰𝗮𝗻'𝘁 𝘀𝘁𝗮𝗻𝗱 𝘆𝗼𝘂 𝘄𝗶𝘁𝗵 𝗼𝘁𝗵𝗲𝗿𝘀🌸✨\n\n___সঠিক মানুষ সব সময়ই রাগি হয়'\n\nকারণ তারা অন্যের সাথে তোমাকে সহ্য করতে পারবে নাহ্!😌🫶🖤\n\n✢━━━━━━━━━━━━━━━✢\n\n𝐎𝐖𝐍𝐄𝐑:- 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍(✷‿✷)"
    ];

    const caption = captions[Math.floor(Math.random() * captions.length)];

    // 🎥 Sad videos list
    const links = [
      "https://drive.google.com/uc?id=1Z-6qll7ACq8Ka1pKpnC3guGcXU0gNvoL",
    "https://drive.google.com/uc?id=1YHm_oC7xItLokbt_MCWu-VdMGavvx-G4",
    "https://drive.google.com/uc?id=1YvDanPpMZKK4s547h9Bsf0uL719AvVEG",
    "https://drive.google.com/uc?id=1YemK-RQH3gUX_I9ThgNJLC89yPF-VtEY",
    "https://drive.google.com/uc?id=1YN25UGQQCpZvN29Y5a84ZCYlL-rc_JL_",
    "https://drive.google.com/uc?id=1YXbox7CyKc6Gu-56WAtAPlxSTs51Yo9n",
    "https://drive.google.com/uc?id=1YNVe1cEM0JM3lj7sU49tuJn4-8ASYVd8",
    "https://drive.google.com/uc?id=1ZDjeuPfIyUkovgmJCRsE7vE67aOe0Sp2",
    "https://drive.google.com/uc?id=1YcJciCtidcUxRGihUyx2uDgDg3cBYUE5",
    "https://drive.google.com/uc?id=1ZIE6xPwXg6_oxG0K7xCWKS04MNyag3QL",
    "https://drive.google.com/uc?id=1ZF9cOD_fj26rpWDf6WOjUQNz8QuRJhkv",
    "https://drive.google.com/uc?id=1ZAXQwA5BsnN555FrWii2bb-kdLaoMxLP",
    "https://drive.google.com/uc?id=1YvWRk-wQ_I8kuJzOuw2Mx7Q-Rrgbw6CT",
    "https://drive.google.com/uc?id=1Z8vKgEBUkKbwgMPvv_6K_lvVsrBca_X8",
    "https://drive.google.com/uc?id=1ZG-BJq7pP4oh93U6tHIKuYvZ8XiidlCV"
    ];

    const link = links[Math.floor(Math.random() * links.length)];
    const cachePath = path.join(__dirname, "cache", "sad.mp4");

    try {
      const response = await axios({
        url: encodeURI(link),
        method: "GET",
        responseType: "stream"
      });

      await fs.ensureDir(path.join(__dirname, "cache"));
      const writer = fs.createWriteStream(cachePath);

      response.data.pipe(writer);

      writer.on("finish", async () => {
        await api.sendMessage(
          {
            body: `「 ${caption} 」`,
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID
        );
        fs.unlinkSync(cachePath);
      });

      writer.on("error", (err) => {
        console.error(err);
        api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID);
      });

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ কিছু একটা সমস্যা হয়েছে ভিডিও আনতে।", event.threadID);
    }
  }
};
