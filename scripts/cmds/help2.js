fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ F A R H A N ]"; 

module.exports = {
  config: {
    name: "help2",
    version: "1.17",
    author: "FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "╭───────❁";

      msg += `\n│✨ 𝗙 𝗔 𝗥 𝗛 𝗔 𝗡 𝗛𝗘𝗟𝗣 𝗟𝗜𝗦𝗧 ✨\n╰────────────❁`; 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────✰『  🗂️ ${category.toUpperCase()}  』`;

          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 2).map((item) => `⚡ ${item}`);
            msg += `\n│${cmds.join("   ")}`;
          }

          msg += `\n╰────────────✰`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n╭─────✰[🌟 ENJOY 🌟]\n│> TOTAL COMMANDS: [${totalCommands}]\n│> TYPE: [ ${prefix}HELP <COMMAND> ]\n╰────────────✰`;
      msg += `\n╭─────✰\n│ 💖 𝗦𝗜𝗭𝗨𝗞𝗔-𝗕𝗢𝗧 💖\n╰────────────✰`; 

      const helpListImages = [
        "https://files.catbox.moe/d5094c.jpg",
        "https://files.catbox.moe/armyev.jpg", // extra sample image
        "https://files.catbox.moe/xzllfg.jpg"
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage)
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `
╭───⊙
│ 🔹 Command: ${configCommand.name}
├── INFO
│ 📝 Description: ${longDescription}
│ 👑 Author: ${author}
│ ⚙ Guide: ${usage}
├── USAGE
│ 🔯 Version: ${configCommand.version || "1.0"}
│ ♻ Role: ${roleText}
╰────────────⊙`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
    }
