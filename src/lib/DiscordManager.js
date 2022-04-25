const path = require("path");
const Discord = require("discord.js");
const LocalStorage = require("node-localstorage").LocalStorage;

const config = require("../config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const localStorage = new LocalStorage(path.resolve(__dirname, "..", "data"));

const targetChannels = new Map(
  localStorage.getItem("targetChannels")
    ? JSON.parse(localStorage.getItem("targetChannels"))
    : null
);

const DiscordManager = async () => {
  await client.login(config.BOT_TOKEN);

  client.on("messageCreate", function (message) {
    if (message.author.bot) return;

    const commands = ["!start-price-tracker", "!stop-price-tracker"];
    if (
      message.content === commands[0] &&
      !targetChannels.get(message.channelId)
    ) {
      targetChannels.set(message.channelId, message.author.id);
      localStorage.setItem(
        "targetChannels",
        JSON.stringify([...targetChannels])
      );
      message.reply(`Price tracker started`);
    } else if (
      message.content === commands[1] &&
      targetChannels.get(message.channelId)
    ) {
      if (targetChannels.get(message.channelId) !== message.author.id) {
        message.reply(`Only the channel setter can stop price tracker`);
      }
      targetChannels.delete(message.channelId);
      localStorage.setItem(
        "targetChannels",
        JSON.stringify([...targetChannels])
      );
      message.reply(`Price tracker stopped`);
    } else {
      return;
    }
  });

  const sendMessage = (message) => {
    const channels = [...targetChannels.keys()];

    channels.forEach((channel) => {
      console.log(client.channels.cache.get(channel));

      if (client.channels.cache.get(channel)) {
        client.channels.cache.get(channel)?.send(message);
      }
    });
  };

  const notifyUser = () => {};

  return { sendMessage, notifyUser };
};

module.exports = DiscordManager;
