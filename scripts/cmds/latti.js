const axios = require("axios");

module.exports = {
  config: {
    name: "latti",
    version: "10.0",
    author: "Farhan",
    countDown: 3,
    role: 0,
    shortDescription: "latti mare 😈",
    category: "fun",
    guide: "{pn} (reply someone)"
  },

  onStart: async function ({ api, event }) {
    try {
      if (!event.messageReply)
        return api.sendMessage("⚠-কাকে ফুটবল এর মতো কিক মারবি মেনশন দে..!", event.threadID, event.messageID);

      const senderID = event.senderID;
      const targetID = event.messageReply.senderID;

      const url = `https://sayem-meme-apixs.onrender.com/usta?senderID=${senderID}&targetID=${targetID}`;

      const res = await axios.get(url, {
        responseType: "stream"
      });

      return api.sendMessage(
        {
          body: "💢 এই নে তুই latti খা তুই latti খাওয়ার যোগ্য, 🦵😈",
          attachment: res.data
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ Error hoise!", event.threadID, event.messageID);
    }
  }
};
