const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
config: {
name: "song",
version: "2.3.0",
author: "imran  | fixed Milon",
countDown: 5,
role: 0,
description: "Search and download songs without prefix",
category: "media",
usePrefix: false // এটিও রাখা হলো যেন হেল্প লিস্টে সমস্যা না হয়
},

onChat: async function ({ api, event, message, args }) {
// মেসেজ যদি 'song' দিয়ে শুরু হয়
if (event.body && event.body.toLowerCase().startsWith("song")) {
const input = event.body.split(/\s+/); // মেসেজটিকে স্পেস দিয়ে ভাগ করা
input.shift(); // 'song' শব্দটিকে বাদ দেওয়া
const query = input.join(" "); // বাকিটা হলো গানের নাম

if (!query) {
return message.reply("❌ Please provide a song name.\n📌 Example: song Let Me Love You");
}

const searchingMessage = await message.reply(`🔍 Searching for "${query}"...\n⏳ Please wait...`);

try {
// Search API
const searchResponse = await axios.get(
`https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`
);
const songData = searchResponse.data[0];

if (!songData || !songData.url) {
return message.reply("⚠️ No results found. Try another song.");
}

const ytUrl = songData.url;
const title = songData.title;
const channelName = songData.channelName || "Unknown";

await api.editMessage(`🎶 Found: ${title}\n⬇️ Downloading...`, searchingMessage.messageID);

// Download API
const downloadResponse = await axios.get(
`https://yt-mp3-imran.vercel.app/api?url=${encodeURIComponent(ytUrl)}`
);

const audioUrl = downloadResponse.data.downloadUrl;
if (!audioUrl) {
return message.reply("⚠️ Failed to fetch download link.");
}

const cachePath = path.join(__dirname, "cache");
if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

const filePath = path.join(cachePath, `song_${Date.now()}.mp3`);

const response = await axios({
method: "get",
url: audioUrl,
responseType: "stream",
});

const writer = fs.createWriteStream(filePath);
response.data.pipe(writer);

writer.on("finish", async () => {
await message.reply({
body: `✅ Download Complete!\n🎧 Title: ${title}\n🎤 Channel: ${channelName}`,
attachment: fs.createReadStream(filePath),
});
fs.unlinkSync(filePath);
});

writer.on("error", (err) => {
console.error(err);
message.reply("❌ Error downloading song.");
});

} catch (err) {
console.error("❌ Error:", err);
message.reply("⚠️ Unexpected error occurred.");
}
}
},

// onStart খালি রাখা হলো যেন মেনু বা হেল্প কমান্ডে কোনো সমস্যা না হয়
onStart: async function () {}
};
