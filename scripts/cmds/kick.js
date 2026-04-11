module.exports = {
	config: {
		name: "kick", // কমান্ডের নাম (এটি ইংরেজিতেই রাখতে হবে)
		version: "1.7", // ভার্সন নম্বর
		author: "FARHAN-KHAN",
		countDown: 5, // একবার ব্যবহারের পর ৫ সেকেন্ড অপেক্ষা করতে হবে
		role: 1, // শুধুমাত্র এডমিনরা ব্যবহার করতে পারবে (Role 1 = Admin)
		description: {
			en: "গ্রুপ থেকে মেম্বার বের করে দেওয়ার কমান্ড।" // কমান্ডের বিবরণ বাংলায়
		},
		category: "গ্রুপ ম্যানেজমেন্ট", // কমান্ডের ক্যাটাগরি বাংলায়
		guide: {
			en: "ব্যবহারের নিয়ম:\n১. যাকে বের করবেন তাকে মেনশন দিন: {pn} @নাম\n২. অথবা তার মেসেজে রিপ্লাই দিয়ে লিখুন: {pn}" // গাইড বাংলায়
		}
	},

	langs: {
		en: {
			needAdmin: "বোটকে আগে গ্রুপের এডমিন বানান, নাহলে আমি কাউকে বের করতে পারবো না! ⚠️",
			noTarget: "যাকে বের করবেন তাকে মেনশন দিন অথবা তার মেসেজে রিপ্লাই দিন। 🧐",
			adminKick: "বস, গ্রুপ এডমিনকে বের করা সম্ভব নয়! ❌",
			error: "বের করতে সমস্যা হচ্ছে। হয়তো আমার পারমিশন নেই বা ইউজারটি গ্রুপে নেই। ⚠️"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		const { threadID, messageReply, mentions } = event;

		try {
			// ফেসবুক সার্ভার থেকে বর্তমান গ্রুপের সব তথ্য (যেমন: এডমিন লিস্ট) নেওয়া হচ্ছে
			const threadInfo = await api.getThreadInfo(threadID);
			
			// গ্রুপের এডমিনদের আইডিগুলো একটি লিস্টে রাখা হচ্ছে
			const adminIDs = threadInfo.adminIDs.map(item => item.id);
			
			// বোটের নিজের আইডি নম্বরটি চিনে নেওয়া হচ্ছে
			const botID = api.getCurrentUserID();

			// বোট নিজে ওই গ্রুপের এডমিন কি না তা যাচাই করা হচ্ছে
			if (!adminIDs.includes(botID)) {
				return message.reply(getLang("needAdmin"));
			}

			// বের করার মূল কাজ শুরু করার ফাংশন
			const kickUser = async (uid) => {
				// যাকে বের করা হচ্ছে সে গ্রুপের এডমিন কি না তা দেখা হচ্ছে
				if (adminIDs.includes(uid)) {
					return message.reply(getLang("adminKick"));
				}
				try {
					// ইউজারকে গ্রুপ থেকে রিমুভ করার আসল কমান্ড
					await api.removeUserFromGroup(uid, threadID);
				} catch (e) {
					return message.reply(getLang("error"));
				}
			};

			// ১. যদি কেউ অন্য কারো মেসেজে রিপ্লাই দিয়ে .kick লেখে
			if (event.type === "message_reply") {
				return await kickUser(messageReply.senderID);
			}

			// ২. যদি কাউকে মেনশন বা ট্যাগ করে .kick @নাম লেখা হয়
			const uids = Object.keys(mentions);
			if (uids.length > 0) {
				for (const uid of uids) {
					await kickUser(uid);
				}
			} else {
				// যদি মেনশন বা রিপ্লাই কিছুই না পাওয়া যায়
				return message.reply(getLang("noTarget"));
			}
		} catch (err) {
			console.error(err);
			return message.reply("একটি অজানা সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
		}
	}
};
