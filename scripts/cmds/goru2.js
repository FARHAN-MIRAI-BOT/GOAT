const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "goru2",
    version: "2.6.1",
    author: "FARHAN-KHAN",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: { en: "Funny Cow edit with secure metadata and name mention." },
    guide: { en: "{pn} @mention or reply" }
  },

/* --- [ 🔐 INTERNAL_SECURE_METADATA ] ---
 * 🤖 BOT NAME: FARHAN BOT
 * 👤 OWNER: FARHAN KHAN 
 * 🔗 FACEBOOK: https://www.facebook.com/MR.FARHAN.111
 * 📞 WHATSAPP: +880 1934640061
 * 📍 LOCATION: KHULNA - CHUADANGA, BD
 * --------------------------------------- */

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    const cacheDir = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else {
      return message.reply("আরে বলদ, কারে গরু বানাবি তারে তো মেনশন দিলি না! 🐄");
    }

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "User";

      const imgLink = "https://i.imgur.com/pkoB67f.jpeg"; 
      const filePath = path.join(cacheDir, `goru_milon_${Date.now()}.png`);

      message.reply("দাঁড়া মামা, ওরে গরু বানাইয়া ঘাস খাওয়ানোর ব্যবস্থা করতেছি... ⏳🔥");

      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
      const userPfpUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${accessToken}`;
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

      const [baseImage, userPfp, targetPfp] = await Promise.all([
        loadImage(imgLink),
        loadImage(userPfpUrl),
        loadImage(targetPfpUrl)
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // --- Sender Profile Picture ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(220, 205, 52, 0, Math.PI * 2, true); 
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(userPfp, 168, 153, 104, 104); 
      ctx.restore();

      // --- Target Profile Picture (Y=340) ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(110, 340, 52, 0, Math.PI * 2, true); 
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(targetPfp, 58, 288, 104, 104); 
      ctx.restore();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      const finalCaption = `এই নে তোর গরুর ছবি! 🐄\n\nঐ ${userName}, এখন ঘাস খাওয়াইতে নিয়া যা নিজেরে। 😂`;

      return api.sendMessage({
        body: finalCaption,
        mentions: [{ tag: userName, id: targetID }],
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (e) {
      console.error("GORU ERROR:", e);
      return message.reply("গরুটা পলাইয়া গেছে মামা! আবার ট্রাই কর। ❌");
    }
  }
};
