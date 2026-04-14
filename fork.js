module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "1.0",
    author: "MR_FARHAN",
    countDown: 3,
    role: 0,
    longDescription: "Returns the link to the official, updated fork of the bot's repository.",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = "🔗 My GitHub Repo:https://github.com/RAFI-GOAT-BOT-2/RAFI-GOAT-BOT-2";
    
    message.reply(text);
  }
};
