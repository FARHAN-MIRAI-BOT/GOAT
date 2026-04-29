const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "5.1",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে (Ultra Optimized)",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  // 🔒 author lock check
  if (module.exports.config.author !== "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ") {
    console.error("❌ Author নাম পরিবর্তন করা হয়েছে। ফাইল চলবে না।");
    return process.exit(1);
  }

  const timerData = {
    "12:00 AM": { text: "⌚┆এখন রাত ১২টা বাজে❥︎খাউয়া দাউয়া করে নেউ,🍽️🍛",         video: "https://files.catbox.moe/y9irm8.mp4" },
    "01:00 AM": { text: "⌚┆এখন রাত ১টা বাজে❥︎সবাই শুয়ে পড়ো,🌌💤",               video: "https://files.catbox.moe/gitfya.mp4" },
    "02:00 AM": { text: "⌚┆এখন রাত ২টা বাজে❥︎প্রেম না কইরা যাইয়া ঘুমা বেক্কল,😾🌠",    video: "https://files.catbox.moe/9aavty.mp4" },
    "03:00 AM": { text: "⌚┆এখন রাত ৩টা বাজে❥︎যারা ছ্যাকা খাইছে তারা জেগে আছে,🫠🌃", video: "https://files.catbox.moe/p78siw.mp4" },
    "04:00 AM": { text: "⌚┆এখন রাত ৪টা বাজে❥︎ফজরের প্রস্তুতি নাও,🌄",               video: "https://files.catbox.moe/9uvit1.mp4" },
    "05:00 AM": { text: "⌚┆এখন সকাল ৫টা বাজে❥︎নামাজ পড়ছো তো?🌅☀️",             video: "https://files.catbox.moe/34etgc.mp4" },
    "06:00 AM": { text: "⌚┆এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই,🌞☕",           video: "https://files.catbox.moe/stk4lq.mp4" },
    "07:00 AM": { text: "⌚┆এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও,🍞",               video: "https://files.catbox.moe/ladp3x.mp4" },
    "08:00 AM": { text: "⌚┆এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে,🌤️✨",         video: "https://files.catbox.moe/l8vx40.mp4" },
    "09:00 AM": { text: "⌚┆এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই!🕘",                 video: "https://files.catbox.moe/hgo8gp.mp4" },
    "10:00 AM": { text: "⌚┆এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি,🌞☀️",             video: "https://files.catbox.moe/ejx7a6.mp4" },
    "11:00 AM": { text: "⌚┆এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও!😌",                 video: "https://files.catbox.moe/gogfic.mp4" },
    "12:00 PM": { text: "⌚┆এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে,❤️",            video: "https://files.catbox.moe/ilmb5j.mp4" },
    "01:00 PM": { text: "⌚┆এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও,🙇🤲",           video: "https://files.catbox.moe/bq7ngm.mp4" },
    "02:00 PM": { text: "⌚┆এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো?🍛🌤️",           video: "https://files.catbox.moe/27mwt2.mp4" },
    "03:00 PM": { text: "⌚┆এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো,🧑‍🔧☀️",               video: "https://files.catbox.moe/eyqcud.mp4" },
    "04:00 PM": { text: "⌚┆এখন বিকাল ৪টা বাজe❥︎আসরের নামাজ পড়ে নাও,🙇🥀",           video: "https://files.catbox.moe/vlgjrp.mp4" },
    "05:00 PM": { text: "⌚┆এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও,🙂‍↕️🌆",                  video: "https://files.catbox.moe/bjjtmk.mp4" },
    "06:00 PM": { text: "⌚┆এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও,😍🌇",                video: "https://files.catbox.moe/22enjn.mp4" },
    "07:00 PM": { text: "⌚┆এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো,❤️🌃",                  video: "https://files.catbox.moe/j7fh66.mp4" },
    "08:00 PM": { text: "⌚┆এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো,🧖🙂‍↔️",              video: "https://files.catbox.moe/btrwyg.mp4" },
    "09:00 PM": { text: "⌚┆এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও,😴🌙",                    video: "https://files.catbox.moe/qb2mq3.mp4" },
    "10:00 PM": { text: "⌚┆এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে,😴🙂‍↕️",           video: "https://files.catbox.moe/l15d8y.mp4" },
    "11:00 PM": { text: "⌚┆এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো,🥰🌌",                    video: "https://files.catbox.moe/rnsdlb.mp4" }
  };

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // 🔥 FIX: per group + per time tracking
  if (!global.__sentMap) global.__sentMap = {};

  const checkTimeAndSend = async () => {
    const now = moment().tz("Asia/Dhaka").format("hh:mm A");

    if (!timerData[now]) return;

    const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
    const { text, video } = timerData[now];

    const videoName = now.replace(/[: ]/g, "_") + ".mp4";
    const videoPath = path.join(cacheDir, videoName);

    if (!fs.existsSync(videoPath)) {
      try {
        const res = await axios.get(video, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, Buffer.from(res.data));
      } catch (err) {
        console.error("Video download failed:", err);
        return;
      }
    }

    const msg =
`◢◤━━━━━━━━━━━━━━━━◥◣
🕒>ᴛɪᴍᴇ: ${now}
${text}
◥◣━━━━━━━━━━━━━━━━◢◤
📅>ᴅᴀᴛᴇ: ${todayDate}
━━━━━━━━━━━━━━━━━━━━
ʙᴏᴛ ᴏᴡɴᴇʀ:-ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ
━━━━━━━━━━━━━━━━━━━━`;

    try {
      const allThreads = await api.getThreadList(1000, null, ["INBOX"]);

      // 🔥 REMOVE DUPLICATE THREADS
      const groups = [...new Map(allThreads.map(t => [t.threadID, t])).values()]
        .filter(t => t.isGroup);

      for (const thread of groups) {

        // 🔥 FIX: prevent same group double send per time
        const key = `${thread.threadID}_${now}`;
        if (global.__sentMap[key]) continue;

        global.__sentMap[key] = true;

        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(videoPath)
        }, thread.threadID);
      }

      console.log("✅ Sent:", now);

    } catch (e) {
      console.error("❌ Error:", e);
    }
  };

  setInterval(checkTimeAndSend, 60000);
};

module.exports.onStart = () => {};
