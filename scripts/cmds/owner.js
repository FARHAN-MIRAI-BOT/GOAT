const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Farhan-Khan",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╔═══❖𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢❖═══╗
 
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆ 
  [🤖]↓:𝐁𝐎𝐓→𝐀𝐃𝐌𝐈𝐍:↓
  ➤ 『 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍 』
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

╠══❖『𝐁𝐈𝐎 𝐀𝐃𝐌𝐈𝐍』❖══╣
 ⊱༅༎😽💚༅༎⊱

-আমি ভদ্র, বেয়াদব দুটোই 🥱✌️  
-তুমি যেটা ডি'জার্ভ করো, আমি সেটাই দেখাবো 🙂  

  ⊱༅༎😽💚༅༎⊱
╠═════════════════╣

[🏠]↓:𝐀𝐃𝐃𝐑𝐄𝐒𝐒:↓
➤ 『 𝐂𝐇𝐔𝐀𝐃𝐀𝐍𝐆𝐀 』
‎
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[🕋]↓:𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍:↓
➤ 『 𝐈𝐒𝐋𝐀𝐌 』

‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[🚻]↓:𝐆𝐄𝐍𝐃𝐄𝐑:↓
➤ 『 𝐌𝐀𝐋𝐄 』

‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[💞]↓:𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍𝐒𝐇𝐈𝐏:↓
➤ 『 𝐒𝐈𝐍𝐆𝐋𝐄 』

‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[🧑‍🔧]↓:𝐖𝐎𝐑𝐊:↓
➤ 『 𝐉𝐎𝐁 』

‎⋆✦⋆═══🅲🅾🅽🆃🅰🅲🆃═══⋆✦⋆

[📞] 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣
➤ https://wa.me/+8801934640061

[🌍] 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 (❶)
➤ https://m.me/61560833120754

[🌍] 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 (❷)
➤ https://www.facebook.com/61560833120754

╚═══❖𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨❖═══╝`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/T8IQ8lb.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send)
  }
};
