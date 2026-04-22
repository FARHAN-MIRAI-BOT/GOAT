const fs = require("fs");    
const path = require("path");    
const axios = require("axios");    
const { loadImage, createCanvas } = require("canvas");    

// 🔒 AUTHOR LOCK
const AUTHOR_KEY = "MR_FARHAN";

module.exports = {    
  config: {    
    name: "hug",    
    aliases: ["hug"],    
    version: "2.1",    
    author: AUTHOR_KEY,    
    countDown: 5,    
    role: 0,    
    shortDescription: "Give someone a hug!",    
    longDescription: "A fun command to give someone a hug with a picture.",    
    category: "fun",    
    guide: "{pn} @mention or reply",    
  },    

  onStart: async function ({ event, api, usersData }) {    

    // 🔒 ANTI MODIFY CHECK
    if (this.config.author !== AUTHOR_KEY) {
      return api.sendMessage(
        "⛔ This file has been modified. Command disabled!",
        event.threadID,
        event.messageID
      );
    }

    try {    
      let mention = Object.keys(event.mentions)[0];    
      let targetID = mention || event.messageReply?.senderID;    

      if (!targetID)    
        return api.sendMessage(    
          "🤗 কাকে hug দিবা? mention দাও বা reply করো!",    
          event.threadID,    
          event.messageID    
        );    

      const huggerID = event.senderID;    

      // Avatar fetch function    
      const getAvatar = async (uid) => {    
        try {    
          const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;    
          const avatarPath = path.join(__dirname, `${uid}_avatar.png`);    
          const res = await axios.get(url, { responseType: "arraybuffer" });    
          fs.writeFileSync(avatarPath, res.data);    
          return avatarPath;    
        } catch (err) {    
          console.log("Avatar Error:", err.message);    
          return null;    
        }    
      };    

      // Background    
      const bg = await loadImage("https://i.imgur.com/eUNHCj3.jpeg");    
      const canvas = createCanvas(bg.width, bg.height);    
      const ctx = canvas.getContext("2d");    
      ctx.drawImage(bg, 0, 0);    

      // Avatars    
      const huggerAvatarPath = await getAvatar(huggerID);    
      const targetAvatarPath = await getAvatar(targetID);    

      if (!huggerAvatarPath || !targetAvatarPath)    
        return api.sendMessage(    
          "❌ Avatar load করতে সমস্যা হয়েছে!",    
          event.threadID,    
          event.messageID    
        );    

      const huggerAvatar = await loadImage(huggerAvatarPath);    
      const targetAvatar = await loadImage(targetAvatarPath);    

      // Hugger (left)    
      ctx.save();    
      ctx.beginPath();    
      ctx.arc(285, 110, 50, 0, Math.PI * 2);    
      ctx.closePath();    
      ctx.clip();    
      ctx.drawImage(huggerAvatar, 235, 60, 100, 100);    
      ctx.restore();    

      // Target (right)    
      ctx.save();    
      ctx.beginPath();    
      ctx.arc(460, 160, 50, 0, Math.PI * 2);    
      ctx.closePath();    
      ctx.clip();    
      ctx.drawImage(targetAvatar, 410, 110, 100, 100);    
      ctx.restore();    

      // Save output    
      const output = path.join(__dirname, "hug_output.png");    
      fs.writeFileSync(output, canvas.toBuffer("image/png"));    

      const targetName = await usersData.getName(targetID);    

      api.sendMessage(    
        {    
          body: `✿•≫───────────────≪•✿\n「 ${targetName} 」\n\nইস তোমাকে তো অন্য বেডা জড়িয়ে ধরল আমি তোমার জামাই কে বলে দিব।😒🔪\n✿•≫───────────────≪•✿`,    
          attachment: fs.createReadStream(output),    
          mentions: [{ tag: targetName, id: targetID }],    
        },    
        event.threadID,    
        () => {    
          try {    
            fs.unlinkSync(output);    
            fs.unlinkSync(huggerAvatarPath);    
            fs.unlinkSync(targetAvatarPath);    
          } catch (e) {}    
        },    
        event.messageID    
      );    

    } catch (err) {    
      console.error(err);    
      api.sendMessage("❌ Something went wrong!", event.threadID, event.messageID);    
    }    
  }    
};
