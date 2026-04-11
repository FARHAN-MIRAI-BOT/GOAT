const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "random",
    version: "2.1.0",
    author: "MR_FARHAN",
    countDown: 15, // ৫-১০ মিনিটের ভিডিওর জন্য সময় একটু বাড়িয়ে ১৫ করা হলো
    role: 0,
    shortDescription: "Sends a random video from the list",
    longDescription: "This command sends a random video from the configured link list.",
    category: "media",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    const videoLinks = [
      "https://files.catbox.moe/wjdxmi.mp4", 
      "https://files.catbox.moe/50c5xk.mp4", 
      "https://files.catbox.moe/gnwsb0.mp4", 
      "https://files.catbox.moe/xvnddb.mp4", "https://files.catbox.moe/ar6eq8.mp4", "https://files.catbox.moe/nu2sa2.mp4", "https://files.catbox.moe/ywr5qk.mp4", "https://files.catbox.moe/m1urbb.mp4", "https://files.catbox.moe/1dphq6.mp4", "https://files.catbox.moe/davog1.mp4", // ৪-১০
      "https://files.catbox.moe/v5fd3j.mp4", "https://files.catbox.moe/59s710.mp4", "https://files.catbox.moe/uwyl06.mp4", "https://files.catbox.moe/qivkp6.mp4", "https://files.catbox.moe/9p5y43.mp4", "https://files.catbox.moe/183i71.mp4", "https://files.catbox.moe/yjryst.mp4", "https://files.catbox.moe/2mteak.mp4", "https://files.catbox.moe/c0iehe.mp4", "https://files.catbox.moe/arrdxy.mp4", // ১১-২০
      "https://files.catbox.moe/yi59sk.mp4", "https://files.catbox.moe/3ubxm3.mp4", "https://files.catbox.moe/7f8wqk.mp4", "https://files.catbox.moe/pvw8bb.mp4", "https://files.catbox.moe/kobwni.mp4", "https://files.catbox.moe/l3fr5m.mp4", "https://files.catbox.moe/juu46e.mp4", "https://files.catbox.moe/1z7rbm.mp4", "https://files.catbox.moe/6k39ei.mp4", "https://files.catbox.moe/3cxmpr.mp4", // ২১-৩০
      "https://files.catbox.moe/1z7rbm.mp4", "https://files.catbox.moe/9a4u5v.mp4", "https://files.catbox.moe/31iuqn.mp4", "https://files.catbox.moe/mbdsqx.mp4", "https://files.catbox.moe/ejpekx.mp4", "https://files.catbox.moe/823nau.mp4", "https://files.catbox.moe/3g7cn7.mp4", "https://files.catbox.moe/76mp19.mp4", "https://files.catbox.moe/jj7hdr.mp4", "", // ৩১-৪০
      "", "", "", "", "", "", "", "", "", "", // ৪১-৫০
      "", "", "", "", "", "", "", "", "", "", // ৫১-৬০
      "", "", "", "", "", "", "", "", "", "", // ৬১-৭০
      "", "", "", "", "", "", "", "", "", "", // ৭১-৮০
      "", "", "", "", "", "", "", "", "", "", // ৮১-৯০
      "", "", "", "", "", "", "", "", "", ""  // ৯১-১০০
    ];

    const validLinks = videoLinks.filter(link => link.trim() !== "");

    if (validLinks.length === 0) {
      return api.sendMessage("⚠️ 𝗡𝗼 𝘃𝗶𝗱𝗲𝗼 𝗹𝗶𝗻𝗸𝘀 𝗳𝗼𝘂𝗻𝗱 𝗶𝗻 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁!", threadID, messageID);
    }

    const randomLink = validLinks[Math.floor(Math.random() * validLinks.length)];
    const randomFileName = `GOAT_V_${Math.floor(Math.random() * 9999)}.mp4`;
    const tempPath = path.join(__dirname, "cache", randomFileName);

    try {
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      // লোডিং মেসেজ (মোটা লেখা/Bold Style)
      api.sendMessage("⏳ 𝗩𝗶𝗱𝗲𝗼 𝗶𝘀 𝗹𝗼𝗮𝗱𝗶𝗻𝗴...\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗮 𝗺𝗼𝗺𝗲𝗻𝘁.", threadID, messageID);

      const response = await axios({
        method: 'get',
        url: randomLink,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(tempPath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          body: `🎥 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗥𝗮𝗻𝗱𝗼𝗺 𝗩𝗶𝗱𝗲𝗼!\n\n🆔 𝗩𝗶𝗱𝗲𝗼 𝗡𝗮𝗺𝗲: ${randomFileName}\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗬𝗼𝘂𝗿 𝗡𝗮𝗺𝗲`, 
          attachment: fs.createReadStream(tempPath)
        }, threadID, () => {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }, messageID);
      });

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿: 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝘀𝗲𝗻𝗱 𝘃𝗶𝗱𝗲𝗼. 𝗧𝗵𝗲 𝗳𝗶𝗹𝗲 𝗺𝗶𝗴𝗵𝘁 𝗯𝗲 𝘁𝗼𝗼 𝗹𝗮𝗿𝗴𝗲!", threadID, messageID);
    }
  }
};
