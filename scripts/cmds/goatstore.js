const axios = require("axios");
const fs = require('fs');
const path = require('path');
const GoatStor = "https://goatstore.vercel.app";

module.exports = {
  config: {
    name: "goatstore",
    aliases: ["gs", "market", "cmdstore"],
    version: "0.0.1",
    role: 2,
    author: "FARHAN-KHAN",
    shortDescription: {
      en: "📌 Goatstore - Your Command Marketplace"
    },
    longDescription: {
      en: "📌 Browse, search, upload, and manage your commands in the GoatStore marketplace with easy sharing cmds."
    },
    category: "𝗠𝗮𝗿𝗸𝗲𝘁",
    cooldowns: 0,
  },

  onStart: async ({ api, event, args, message }) => {
    const sendBeautifulMessage = (content) => {
      const header = "╭──『 🐐GoatStore 』──╮\n";
      const footer = "\n╰──────────────╯";
      return message.reply(header + content + footer);
    };

    try {
      if (!args[0]) {
        return sendBeautifulMessage(
          "\n" +
          `╭─❯ ${event.body} show <ID>\n├ 📦 Get command code\n╰ Example: show 1\n\n` +
          `╭─❯ ${event.body} page <number>\n├ 📄 Browse commands\n╰ Example: page 1\n\n` +
          `╭─❯ ${event.body} search <query>\n├ 🔍 Search commands\n╰ Example: search music\n\n` +
          `╭─❯ ${event.body} trending\n├ 🔥 View trending\n╰ Most popular commands\n\n` +
          `╭─❯ ${event.body} status\n├ 📊 View statistics\n╰ Marketplace insights\n\n` +
          `╭─❯ ${event.body} like <ID>\n├ 💝 Like a command\n╰ Example: like 1\n\n` +
          `╭─❯ ${event.body} upload <name>\n├ ⬆️ Upload command\n╰ Example: upload goatStor\n\n` +
          "💫 𝗧𝗶𝗽: Use `Help GoatStore` For Details"
        );
      }

      const command = args[0].toLowerCase();

      switch (command) {
        case "show": {
          const itemID = parseInt(args[1]);
          if (isNaN(itemID)) return sendBeautifulMessage("\n[⚠️]➜ Please provide a valid item ID.");
          const response = await axios.get(`${GoatStor}/api/item/${itemID}`);
          const item = response.data;
          
          
          const bangladeshTime = new Date(item.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

          return sendBeautifulMessage(
            "\n" +
            `╭─❯ 👑 𝗡𝗮𝗺𝗲\n╰ ${item.itemName}\n\n` +
            `╭─❯ 🆔 𝗜𝗗\n╰ ${item.itemID}\n\n` +
            `╭─❯ ⚙️ 𝗧𝘆𝗽𝗲\n╰ ${item.type || 'Unknown'}\n\n` +
            `╭─❯ 📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻\n╰ ${item.description}\n\n` +
            `╭─❯ 👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿\n╰ ${item.authorName}\n\n` +
            `╭─❯ 📅 𝗔𝗱𝗱𝗲𝗱\n╰ ${bangladeshTime}\n\n` +
            `╭─❯ 👀 𝗩𝗶𝗲𝘄𝘀\n╰ ${item.views}\n\n` +
            `╭─❯ 💝 𝗟𝗶𝗸𝗲𝘀\n╰ ${item.likes}\n\n` +
            `╭─❯ 🔗 𝗥𝗮𝘄 𝗟𝗶𝗻𝗸\n╰ ${GoatStor}/raw/${item.rawID}`
          );
        }

        case "page": {
          const page = parseInt(args[1]) || 1;
          const { data: { items, total } } = await axios.get(`${GoatStor}/api/items?page=${page}&limit=5`);
          const totalPages = Math.ceil(total / 5);
          if (page <= 0 || page > totalPages) {
            return sendBeautifulMessage("\n[⚠️]➜ Invalid page number.");
          }
          const itemsList = items.map((item, index) =>
            `╭─❯ ${index + 1}. 📦 ${item.itemName}\n` +
            `├ 🆔 𝗜𝗗: ${item.itemID}\n` +
            `├ ⚙️ 𝗧𝘆𝗽𝗲: ${item.type}\n` +
            `├ 📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${item.description}\n` +
            `├ 👀 𝗩𝗶𝗲𝘄𝘀: ${item.views}\n` +
            `├ 💝 𝗟𝗶𝗸𝗲𝘀: ${item.likes}\n` +
            `╰ 👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿: ${item.authorName}\n`
          ).join("\n");
          return sendBeautifulMessage(`\n📄 𝗣𝗮𝗴𝗲 ${page}/${totalPages}\n\n${itemsList}`);
        }

        case "search": {
          const query = args.slice(1).join(" ");
          if (!query) return sendBeautifulMessage("\n[⚠️]➜ Please provide a search query.");
          const { data } = await axios.get(`${GoatStor}/api/items?search=${encodeURIComponent(query)}`);
          const results = data.items;
          if (!results.length) return sendBeautifulMessage("\n❌ No matching results found.");
          const searchList = results.slice(0, 5).map((item, index) =>
            `╭─❯ ${index + 1}. 📦 ${item.itemName}\n` +
            `├ 🆔 𝗜𝗗: ${item.itemID}\n` +
            `├ ⚙️ 𝗧𝘆𝗽𝗲: ${item.type}\n` +
            `├ 👀 𝗩𝗶𝗲𝘄𝘀: ${item.views}\n` +
            `├ 💝 𝗟𝗶𝗸𝗲𝘀: ${item.likes}\n` +
            `╰ 👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿: ${item.authorName}\n`
          ).join("\n");
          return sendBeautifulMessage(`\n📝 Query: "${query}"\n\n${searchList}`);
        }

        case "trending": {
          const { data } = await axios.get(`${GoatStor}/api/trending`);
          const trendingList = data.slice(0, 5).map((item, index) =>
            `╭─❯ ${index + 1}. 🔥 ${item.itemName}\n` +
            `├ 💝 𝗟𝗶𝗸𝗲𝘀: ${item.likes}\n` +
            `╰ 👀 𝗩𝗶𝗲𝘄𝘀: ${item.views}\n`
          ).join("\n");
          return sendBeautifulMessage(`\n${trendingList}`);
        }

        case "status": {
          const { data: stats } = await axios.get(`${GoatStor}/api/stats`);
          const { hosting, totalCommands, totalLikes, dailyActiveUsers, popularTags, topAuthors, topViewed } = stats;
          const uptimeStr = `${hosting?.uptime?.years}y ${hosting?.uptime?.months}m ${hosting?.uptime?.days}d ${hosting?.uptime?.hours}h ${hosting?.uptime?.minutes}m ${hosting?.uptime?.seconds}s`;
          const tagList = popularTags.map((tag, i) =>
            `${i + 1}. ${tag._id || 'Unknown'} (${tag.count})`
          ).join('\n');
          const authorList = topAuthors.map((a, i) =>
            `${i + 1}. ${a._id || 'Unknown'} (${a.count})`
          ).join('\n');
          const viewedList = topViewed.map((v, i) =>
            `${i + 1}. ${v.itemName} 𝗜𝗗: ${v.itemID}\n 𝗩𝗶𝗲𝘄𝘀: ${v.views}`
          ).join('\n\n');
          return sendBeautifulMessage(
            `\n╭─❯ 📦 Total Commands: ${totalCommands}\n` +
            `├─❯ 💝 Total Liks: ${totalLikes}\n` +
            `├─❯ 👥 Daily Users: ${dailyActiveUsers}\n` +
            `╰─❯ ⏰ Uptime: ${uptimeStr}\n\n` +
            `══『 🌟 Top Authors 』══\n╰${authorList}\n\n` +
            `══『 🔥 Most Viewed 』══\n╰${viewedList}\n` +
            `      🌐 𝗛𝗼𝘀𝘁𝗶𝗻𝗴 𝗜𝗻𝗳𝗼\n` +
            `╭─❯ 💻 𝗦𝘆𝘀𝘁𝗲𝗺\n` +
            `├ 🔧 ${hosting.system.platform} (${hosting.system.arch})\n` +
            `├ 📌 Node ${hosting.system.nodeVersion}\n` +
            `╰ 🖥️ CPU Cores: ${hosting.system.cpuCores}`
          );
        }

        case "like": {
          const likeItemId = parseInt(args[1]);
          if (isNaN(likeItemId)) return sendBeautifulMessage("\n[⚠️]➜ Please provide a valid item ID.");
          const { data } = await axios.post(`${GoatStor}/api/items/${likeItemId}/like`);
          if (data.success) {
            return sendBeautifulMessage(
              `\n╭─❯ ✨ 𝗦𝘁𝗮𝘁𝘂𝘀\n╰ Successfully liked!\n\n╭─❯ 💝 𝗧𝗼𝘁𝗮𝗹 𝗟𝗶𝗸𝗲𝘀\n╰ ${data.likes}`
            );
          } else {
            return sendBeautifulMessage("\n[⚠️]➜ Failed to like the command.");
          }
        }

        case "upload": {
          const commandName = args[1];
          if (!commandName) return sendBeautifulMessage("\n[⚠️]➜ Please provide a command name.");
          const commandPath = path.join(process.cwd(), 'scripts', 'cmds', `${commandName}.js`);
          if (!fs.existsSync(commandPath)) return sendBeautifulMessage(`\n❌ File'${commandName}.js' not found`);
          try {
            const code = fs.readFileSync(commandPath, 'utf8');
            let commandFile;
            try {
              commandFile = require(commandPath);
            } catch (err) {
              return sendBeautifulMessage("\n[⚠️]➜  Invalid command file.");
            }
            const uploadData = {
              itemName: commandFile.config?.name || commandName,
              description: commandFile.config?.longDescription?.en || commandFile.config?.shortDescription?.en || "No description",
              type: "GoatBot",
              code,
              authorName: commandFile.config?.author || event.senderID || "Unknown"
            };
            const response = await axios.post(`${GoatStor}/v1/paste`, uploadData);
            if (response.data.success) {
              const { itemID, link } = response.data;
              return sendBeautifulMessage(
                "\n" +
                `╭─❯ ✅ 𝗦𝘁𝗮𝘁𝘂𝘀\n╰ command uploaded successfully\n\n` +
                `╭─❯ 👑 𝗡𝗮𝗺𝗲\n╰ ${uploadData.itemName}\n\n` +
                `╭─❯ 🆔 𝗜𝗗\n╰ ${itemID}\n\n` +
                `╭─❯ 👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿\n╰ ${uploadData.authorName}\n\n`  +
                `╭─❯ 🔗 𝗥𝗮𝘄 𝗟𝗶𝗻𝗸\n╰ ${link}`
              );
            }
            return sendBeautifulMessage("\n[⚠️]➜ Failed to upload the command.");
          } catch (error) {
            console.error("Upload error:", error);
            return sendBeautifulMessage("\n[⚠️]➜ An unexpected error occurred while uploading the command.");
          }
        }

        default:
          return sendBeautifulMessage("\n[⚠️]➜ Invalid subcommand. Use `Help GoatStore` for options");
      }
    } catch (err) {
      console.error("GoatStore Error:", err);
      return sendBeautifulMessage("\n[⚠️]➜ An unexpected error occurred.");
    }
  }
};
