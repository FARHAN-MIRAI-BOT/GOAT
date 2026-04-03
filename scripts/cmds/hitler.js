const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "hitler",
                aliases: ["হিটলার"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "কাউকে হিটলার বানিয়ে মজার ছবি তৈরি করুন",
                        en: "Create a funny Hitler image of someone",
                        vi: "Tạo một bức ảnh Hitler vui nhộn về ai đó"
                },
                category: "fun",
                guide: {
                        bn: '   {pn} <@tag/reply/UID>: কাউকে হিটলার বানাতে ট্যাগ করুন',
                        en: '   {pn} <@tag/reply/UID>: Tag/Reply to make someone Hitler',
                        vi: '   {pn} <@tag/reply/UID>: Gắn thẻ để biến ai đó thành Hitler'
                }
        },

        langs: {
                bn: {
                        noTarget: "× বেবি, কাউকে মেনশন দাও, রিপ্লাই করো অথবা UID দাও! 🎖",
                        success: "এই নাও তোমার হিটলার ছবি বেবি! 🐸",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noTarget: "× Baby, mention, reply, or provide UID of the target! 🎖",
                        success: "Here's your Hitler image baby! 🐸",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noTarget: "× Cưng ơi, hãy gắn thẻ, phản hồi hoặc cung cấp UID! 🎖",
                        success: "Ảnh Hitler của cưng đây! 🐸",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const { mentions, messageReply } = event;
                let id;

                if (Object.keys(mentions).length > 0) {
                        id = Object.keys(mentions)[0];
                } else if (messageReply) {
                        id = messageReply.senderID;
                } else if (args[0] && !isNaN(args[0])) {
                        id = args[0];
                }

                if (!id) return message.reply(getLang("noTarget"));

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
                const filePath = path.join(cacheDir, `hitler_${id}.png`);

                try {
                        api.setMessageReaction("🎖", event.messageID, () => {}, true);
                        
                        const baseUrl = await baseApiUrl();
                        const url = `${baseUrl}/api/dig?type=hitler&user=${id}`;

                        const response = await axios.get(url, { responseType: "arraybuffer" });
                        fs.writeFileSync(filePath, Buffer.from(response.data));

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("Hitler Error:", err);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
