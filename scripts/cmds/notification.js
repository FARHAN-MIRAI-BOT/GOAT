const { getStreamsFromAttachment } = global.utils;
const moment = require("moment-timezone");
const crypto = require("crypto");

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "2.3",
    author: "FARHAN-KHAN",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Send stylish notification with media to all groups"
    },
    longDescription: {
      en: "Send notification (text, photo, video, audio, etc.) from admin to all groups with aesthetic style"
    },
    category: "owner",
    guide: { en: "{pn} <message or reply to media>" },
    envConfig: { delayPerGroup: 300 }
  },

  langs: {
    en: {
      missingMessage: "Please enter a message or reply to a media file to send.",
      sendingNotification: "📢 Sending notification to %1 groups...",
      sentNotification: "✅ Successfully sent notification to %1 groups.",
      errorSendingNotification: "⚠️ Error while sending to %1 groups:\n%2"
    }
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang, usersData, config }) {

    // 🔒 OWNER NAME LOCK (STRONG)
    const originalAuthor = "FARHAN-KHAN";
    const expectedHash = crypto.createHash("md5").update(originalAuthor).digest("hex");

    const currentHash = crypto
      .createHash("md5")
      .update(module.exports.config.author)
      .digest("hex");

    if (currentHash !== expectedHash) {
      return message.reply("⛔ Unauthorized edit detected! Command disabled.");
    }

    const { delayPerGroup } = envCommands[commandName];
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID) || "Unknown User";

    const now = moment().tz("Asia/Dhaka");
    const timeString = now.format("hh:mm A");
    const dateString = now.format("DD/MM/YYYY");

    // Handle message text
    const msgText = args.join(" ") || "";

    // Collect attachments from message or reply
    const attachments = [
      ...(event.attachments || []),
      ...(event.messageReply?.attachments || [])
    ].filter(item => ["photo", "animated_image", "video", "audio", "sticker"].includes(item.type));

    if (!msgText && attachments.length === 0)
      return message.reply(getLang("missingMessage"));

    let streamAttachments = [];
    if (attachments.length > 0) {
      try {
        streamAttachments = await getStreamsFromAttachment(attachments);
      } catch (err) {
        console.error("Attachment processing error:", err);
      }
    }

    const owner = "𓆩𝆠፝𝆠꯭፝֟𝆠፝𝐅𝐀𝐑𝐇𝐀𝐍-𝐊𝐇𝐀𝐍𝆠꯭፝֟𝆠꯭፝֟𓆪"; 
    const fb = "https://m.me/MR.FARHAN.420";

    const formSend = {
      body:
`╭━━〔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〕━━╮
│>𝐎𝐖𝐍𝐄𝐑:= ${owner}
│
│>𝐌𝐄𝐒𝐒𝐄𝐍𝐆𝐄𝐑:= ${fb}
╰━━━━━━━━━━━━━━━━━━╯

🕒 Time: ${timeString} - ${dateString}

────────────────────

${msgText || "(media only)"}

╰━━━━━━━━━━━━━━━━━━━╯`,
      attachment: streamAttachments
    };

    // Get all active threads
    const allThreads = (await threadsData.getAll()).filter(
      t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup
    );

    message.reply(getLang("sendingNotification", allThreads.length));

    let sent = 0;
    const failed = [];

    for (const thread of allThreads) {
      try {
        await api.sendMessage(formSend, thread.threadID);
        sent++;
      } catch (e) {
        failed.push({ id: thread.threadID, err: e.message });
      }
      await new Promise(res => setTimeout(res, delayPerGroup));
    }

    let report = "";
    if (sent > 0) report += getLang("sentNotification", sent) + "\n";
    if (failed.length > 0)
      report += getLang(
        "errorSendingNotification",
        failed.length,
        failed.map(f => `\n - ${f.err} [${f.id}]`).join("")
      );

    message.reply(report || "✅ All done!");
  }
};
