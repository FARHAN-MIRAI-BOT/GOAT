module.exports = {
  config: {
    name: "allnick",
    aliases: ["an"],
    version: "1.4",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Change or reset nickname of all members"
    },
    longDescription: {
      en: "Change or reset nickname of all members in the current group"
    },
    category: "owner",
    guide: {
      en: "{pn} <nickname | cancel>"
    },
    envConfig: {
      delayPerUser: 200
    }
  },

  langs: {
    en: {
      missingNickname: "⚠️ Please enter a nickname or 'cancel'",
      start: "⏳ Processing %1 members...",
      success: "✅ Done for all members",
      partial: "⚠️ Done, but failed for %1 users:\n%2",
      error: "❌ Error: %1",
      onlyGroup: "❌ This command only works in groups",
      locked: "⛔ File locked! Don't change author name.",
      resetDone: "🔄 All nicknames removed successfully"
    }
  },

  onStart: async function ({ api, event, args, message, getLang }) {

    // 🔒 AUTHOR LOCK
    if (module.exports.config.author !== "MR_FARHAN") {
      return message.reply(getLang("locked"));
    }

    const threadID = event.threadID;
    const input = args.join(" ").trim();
    const delay = module.exports.config.envConfig.delayPerUser || 200;

    if (!input) {
      return message.reply(getLang("missingNickname"));
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);

      if (!threadInfo.isGroup) {
        return message.reply(getLang("onlyGroup"));
      }

      const members = threadInfo.participantIDs;

      await message.reply(getLang("start", members.length));

      let failed = [];

      for (const userID of members) {
        try {
          // 🔥 cancel দিলে nickname remove হবে
          if (input.toLowerCase() === "cancel") {
            await api.changeNickname("", threadID, userID);
          } else {
            await api.changeNickname(input, threadID, userID);
          }

          await new Promise(res => setTimeout(res, delay));

        } catch (err) {
          failed.push(userID);
        }
      }

      if (failed.length === 0) {
        if (input.toLowerCase() === "cancel") {
          message.reply(getLang("resetDone"));
        } else {
          message.reply(getLang("success"));
        }
      } else {
        message.reply(getLang("partial", failed.length, failed.join(", ")));
      }

    } catch (err) {
      message.reply(getLang("error", err.message));
    }
  }
};
