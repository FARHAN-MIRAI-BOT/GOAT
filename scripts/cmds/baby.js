const axios = require('axios');

const baseApiUrl = async () => {
  return "https://your-baby-apixs.onrender.com";
};

module.exports.config = {
  name: "bby",
  aliases: ["baby"],
  version: "0.0.1",
  author: "S AY EM",
  countDown: 0,
  role: 0,
  description: "update simsim api by Sayem",
  category: "CHARTING",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nmsg [YourMessage] OR\nlist OR\nlist all"
  }
};

module.exports.onStart = async ({
  api,
  event,
  args,
  usersData
}) => {

  const link = `${await baseApiUrl()}`;
  const sayem = args.join(" ").toLowerCase();

  try {

    if (!args[0]) {

      const ran = ["Bolo baby", "hum bby", "Yes' i am here", "type .help baby"];

      const msg = await api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply ??= {};
      global.GoatBot.bbyReply[msg.messageID] = true;

      return;
    }

    if (args[0] === 'list') {

      if (args[1] === 'all') {

        const data = (await axios.get(`${link}/list-all`)).data;

        const limit = parseInt(args[2]) || 100;

        const teachers = data.teachers?.slice(0, limit) || [];

        const result = await Promise.all(
          teachers.map(async (item) => {

            const uid = item.uid;
            const value = item.teaches;

            const name = await usersData.getName(uid).catch(() => uid);

            return {
              name,
              value
            };

          })
        );

        result.sort((a, b) => b.value - a.value);

        const output = result
          .map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`)
          .join("\n");

        return api.sendMessage(
          `Total Teach = ${data.total_questions || 0}\n👑 | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );

      } else {

        const d = (await axios.get(`${link}/list-xs`)).data;

        return api.sendMessage(
          `❇️ | Total Teach = ${d.total_questions || "api off"}\n♻️ | Total Response = ${d.total_answers || "api off"}`,
          event.threadID,
          event.messageID
        );

      }

    }

    if (args[0] === 'msg') {

      const fuk = sayem.replace("msg ", "");

      const d = (await axios.get(`${link}/baby-xs`, {
        params: { ask: fuk }
      })).data;

      return api.sendMessage(`Message ${fuk} = ${d.respond}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach') {

      const text = sayem.replace("teach ", "");

      if (!text.includes("-"))
        return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);

      const [ask, answers] = text.split(/\s*-\s*/);

      const replyList = answers.split(",");

      let added = 0;
      let replyText = "";

      for (let i = 0; i < replyList.length; i++) {

        const ans = replyList[i].trim();

        await axios.get(`${link}/teach-xs`, {
          params: {
            ask: ask.trim(),
            ans: ans
          }
        });

        added++;
        replyText += `${i + 1}. ${ans}\n`;

      }

      return api.sendMessage(
`📚 | New Teach Added

❓ Question: ${ask}

💬 Replies Added: ${added}

${replyText}`,
        event.threadID,
        event.messageID
      );
    }

    const d = (await axios.get(`${link}/baby-xs`, {
      params: { ask: sayem }
    })).data;

    const msg = await api.sendMessage(d.respond, event.threadID, event.messageID);

    global.GoatBot.bbyReply ??= {};
    global.GoatBot.bbyReply[msg.messageID] = true;

  } catch (e) {

    console.log(e);

    api.sendMessage("Check console for error", event.threadID, event.messageID);

  }
};

module.exports.onChat = async ({
  api,
  event
}) => {

  try {

    const body = event.body ? event.body.toLowerCase() : "";

    const link = `${await baseApiUrl()}`;


    if (
      event.messageReply &&
      global.GoatBot.bbyReply &&
      global.GoatBot.bbyReply[event.messageReply.messageID]
    ) {

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: body }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply[msg.messageID] = true;

      return;
    }


    if (
      body.startsWith("baby") ||
      body.startsWith("Baby") ||
      body.startsWith("BABY") ||
      body.startsWith("bby") ||
      body.startsWith("Bby") ||
      body.startsWith("বেবি") ||
      body.startsWith("janu") ||
      body.startsWith("Janu") ||
      body.startsWith("JANU") ||
      body.startsWith("জানু") ||
      body.startsWith("jan") ||
      body.startsWith("Jan") ||
      body.startsWith("JAN") ||
      body.startsWith("জান") ||
      body.startsWith("sizuka") ||
      body.startsWith("Sizuka") ||
      body.startsWith("SIZUKA") ||
      body.startsWith("শিজুকা") ||
      body.startsWith("সিজুকা") ||
      body.startsWith("sizu") ||
      body.startsWith("Sizu") ||
      body.startsWith("SIZU") ||
      body.startsWith("শিজু") ||      
      body.startsWith("সিজু")
    ) {

      const arr = body.replace(/^\S+\s*/, "");

      const randomReplies = [
                                "𝗕𝗮𝗯𝘆 𝗞𝗵𝘂𝗱𝗮 𝗟𝗮𝗴𝗰𝗵𝗲🥺",
                                "𝗛𝗼𝗽 𝗕𝗲𝗱𝗮😾,𝗕𝗼𝘀𝘀 বল 𝗕𝗼𝘀𝘀😼",
                                "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",                      
                                "𝗡𝗮𝘄 𝗔𝗺𝗮𝗿 𝗕𝗼𝘀𝘀 𝗞 𝗠𝗲𝗮𝘀𝘀𝗮𝗴𝗲 𝗗𝗮𝘄 https://www.facebook.com/DEVIL.FARHAN.420",
                                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
                                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘",
                                "এটায় দেখার বাকি সিলো_🙂🙂🙂",
                                "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
                                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
                                "বেশি 𝗕𝗯𝘆 𝗕𝗲𝗯𝘆 করলে 𝗟𝗲𝗮𝘃𝗲 নিবো কিন্তু 😒😒",
                                "__বেশি বেবি বললে কামুর দিমু 🤭🤭",
                                "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
                                "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
                                "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
                                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, ফারহান, ফারহান ও তো করতে পারো😑?",
                                "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
                                "হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
                                "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
                                "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                                "খাওয়া দাওয়া করসো 🙄",
                                "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
                                "আরে আমি মজা করার 𝗠𝗼𝗼𝗱 এ নাই😒",
                                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
                                "আরে Bolo আমার জান, কেমন আসো? 😚",
                                "একটা 𝗕𝗙 খুঁজে দাও 😿",
                                "𝗢𝗶 𝗠𝗮𝗺𝗮 𝗔𝗿 𝗗𝗮𝗸𝗶𝘀 𝗡𝗮 𝗣𝗶𝗹𝗶𝘇 😿",
                                "𝗔𝗺𝗮𝗿 𝗝𝗮𝗻𝘂 𝗟𝗮𝗴𝗯𝗲 𝗧𝘂𝗺𝗶 𝗞𝗶 𝗦𝗶𝗻𝗴𝗲𝗹 𝗔𝗰𝗵𝗼?",
                                "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
                                "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
                                "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
                                "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
                                "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                                "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
                                "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
                                "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
                                "বলো কি করতে পারি তোমার জন্য 😚",
                                "কথা দেও আমাকে পটাবা...!! 😌",
                                "বার বার Disturb করেছিস কোনো, আমার জানু এর সাথে ব্যাস্ত আসি 😋",
                                "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
                                "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
                                "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
                                "আজকে আমার mন ভালো নেই 🙉",
                                "আমি হাজারো মশার 𝗖𝗿𝘂𝘀𝗵😓",
                                "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
                                "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
                                "মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚",
                                "ডাকলেই কিন্তু চলে আছি-!😒"
      ];

      if (!arr) {

        const msg = await api.sendMessage(
          randomReplies[Math.floor(Math.random() * randomReplies.length)],
          event.threadID,
          event.messageID
        );

        global.GoatBot.bbyReply ??= {};
        global.GoatBot.bbyReply[msg.messageID] = true;

        return;
      }

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: arr }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply ??= {};
      global.GoatBot.bbyReply[msg.messageID] = true;

    }

  } catch (err) {

    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);

  }

};
                    
