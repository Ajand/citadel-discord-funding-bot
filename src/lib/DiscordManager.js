const path = require("path");
const Discord = require("discord.js");
const LocalStorage = require("node-localstorage").LocalStorage;

const config = require("../config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const localStorage = new LocalStorage(
  path.resolve(__dirname, "..", "..", "data")
);

const targetChannels = new Map(
  localStorage.getItem("targetChannels")
    ? JSON.parse(localStorage.getItem("targetChannels"))
    : null
);
const removeFirstWord = (str) => {
  console.log(str);
  const indexOfSpace = str.indexOf(" ");

  if (indexOfSpace === -1) {
    return "";
  }

  return str.substring(indexOfSpace + 1);
};

const DiscordManager = async () => {
  await client.login(config.BOT_TOKEN);

  client.on("messageCreate", function (message) {
    if (message.author.bot) return;

    const commands = [
      "!start-price-tracker",
      "!stop-price-tracker",
      "!set-notify-role",
    ];
    if (
      message.content === commands[0] &&
      !targetChannels.get(message.channelId)
    ) {
      targetChannels.set(message.channelId, { author: message.author.id });
      localStorage.setItem(
        "targetChannels",
        JSON.stringify([...targetChannels])
      );
      message.reply(`Price tracker started`);
    } else if (
      message.content === commands[1] &&
      targetChannels.get(message.channelId)
    ) {
      if (targetChannels.get(message.channelId).author !== message.author.id) {
        message.reply(`Only the channel setter can stop price tracker`);
      }
      targetChannels.delete(message.channelId);
      localStorage.setItem(
        "targetChannels",
        JSON.stringify([...targetChannels])
      );
      message.reply(`Price tracker stopped`);
    } else if (
      message.content.startsWith(commands[2]) &&
      targetChannels.get(message.channelId)
    ) {
      const roleName = removeFirstWord(message.content);

      const foundRole = message.guild.roles.cache.find(
        (role) => role.name === roleName
      );

      if (foundRole) {
        targetChannels.set(message.channelId, {
          ...targetChannels.get(message.channelId),
          notifyRole: foundRole.id,
        });
        localStorage.setItem(
          "targetChannels",
          JSON.stringify([...targetChannels])
        );
        message.reply(`In case of emergency I will notify <@&${foundRole.id}>`);
      } else {
        message.reply(
          `No role found. Are you sure your desired role is "${roleName}"?`
        );
      }
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

  const sendNotifyMessage = (message) => {
    const channels = [...targetChannels.keys()];

    channels.forEach((channel) => {
      const notifyRole = targetChannels.get(channel).notifyRole;

      if (notifyRole && client.channels.cache.get(channel)) {
        const transformedMessage = message.replace(
          "::notifyRole::",
          `<@&${notifyRole}>`
        );

        client.channels.cache.get(channel)?.send(transformedMessage);
      }
    });
  };

  return { sendMessage, sendNotifyMessage };
};

module.exports = DiscordManager;
