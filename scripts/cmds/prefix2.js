const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "prefix2",
    version: "1.0",
    author: "Farhan-Khan", // ⚠️ DO NOT CHANGE
    countDown: 5,
    role: 0,
    shortDescription: "Islamic quotes",
    longDescription: "Send random Islamic quote with image",
    category: "fun"
  },

  onStart: async function({ message, __GLOBAL }) {

    // 🔒 Author lock
    if (module.exports.config.author !== "Farhan-Khan") {
      return message.reply("⚠️ Author change detected!");
    }

    try {
      // Get bot prefix from config
      const prefix = __GLOBAL.config?.PREFIX || "";

      // Only trigger if message is exactly the prefix
      const msgText = (message.body || "").trim();
      if (msgText !== prefix) return;

      // Random quotes
      const quotes = [
        "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻",
        "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না! আল্লাহ অবশ্যই ক্ষমা করে দিবেন☺️🌻",
        "- ইসলাম অহংকার করতে শেখায় না!🌸 ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
        "- বেপর্দা নারী যদি নায়িকা হতে পারে 🤗🥀 তবে পর্দাশীল নারী ইসলামের শাহাজাদী 🌺🥰",
        "┏━━━━ ﷽ ━━━━┓\n🖤﷽ স্মার্ট নয় ইসলামিক ﷽🥰\n🖤﷽ জীবন সঙ্গি খুঁজুন ﷽🥰\n┗━━━━ ﷽ ━━━━┛",
        "ღ࿐– যখন বান্দার জ্বর হয় 😇🖤তখন গুনাহগুলো ঝড়ে পড়তে থাকে☺️\n– হযরত মুহাম্মদ(সাঃ)",
        "~🍂🦋 Happiness is enjoying the little things... Alhamdulillah 💗🥰",
        "•___💜🌈___• তুমি আসক্ত হও, তবে নেশায় নয় আল্লাহর ইবাদতে 🖤✨",
        "হাসতে হাসতে একদিন সবাইকে কাঁদিয়ে বিদায় নিবো 🙂💔",
        "🦋🥀 হাজারো স্বপ্নের শেষ ঠিকানা কবরস্থান 🤲",
        "প্রসঙ্গ যখন ধর্ম নিয়ে, ইসলামই সেরা ❤️",
        "কেউ পছন্দ না করলে কি যায় আসে, আল্লাহ তো পছন্দ করেই বানিয়েছে 🥰",
        "এত অহংকার করে লাভ নেই, মৃত্যু নিশ্চিত 🖤",
        "ছিঁড়ে ফেলুন অতীতের পাপ, ফিরে আসুন রবের ভালোবাসায় 🌻",
        "বুকে কষ্ট নিয়ে আলহামদুলিল্লাহ বলা বিশ্বাসের প্রমাণ ❤️",
        "আল্লাহর ভালোবাসা পেতে চাইলে রাসুল (সা:) কে অনুসরণ করো 🥰"
      ];

      // Random images
      const images = [
        "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
        "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
        "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
        "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg",
        "https://i.postimg.cc/mgrPxDs5/images-27.jpg",
        "https://i.postimg.cc/yxXDK3xw/images-26.jpg",
        "https://i.postimg.cc/kXqVcsh9/muslim-boy-having-worship-praying-fasting-eid-islamic-culture-mosque-73899-1334.webp",
        "https://i.postimg.cc/hGzhj5h8/muslims-reading-from-quran-53876-20958.webp",
        "https://i.postimg.cc/x1Fc92jT/blue-mosque-istanbul-1157-8841.webp",
        "https://i.postimg.cc/j5y56nHL/muhammad-ali-pasha-cairo-219717-5352.webp",
        "https://i.postimg.cc/dVWyHfhr/images-1-21.jpg",
        "https://i.postimg.cc/q7MGgn3X/images-1-22.jpg",
        "https://i.postimg.cc/sX5CXtSh/images-1-16.jpg",
        "https://i.postimg.cc/66Rp2Pwz/images-1-17.jpg",
        "https://i.postimg.cc/Qtzh9pY2/images-1-18.jpg",
        "https://i.postimg.cc/MGrhdz0R/images-1-19.jpg",
        "https://i.postimg.cc/LsMSj9Ts/images-1-20.jpg",
        "https://i.postimg.cc/KzNXyttX/images-1-13.jpg"
      ];

      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      const imgUrl = images[Math.floor(Math.random() * images.length)];

      const filePath = path.join(__dirname, "cache", `${Date.now()}.jpg`);
      const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, res.data);

      await message.reply({
        body: `「 ${quote} 」`,
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.log(err);
      message.reply("❌ Error!");
    }
  }
};
