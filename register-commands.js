const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("./welcomer.config.json");
const { SlashCommandBuilder } = require('@discordjs/builders');
let clientId = config.client_id;
let guildId = config.guild_id;

let token = config.token;
const rest = new REST({ version: "9" }).setToken(token);
const command = new SlashCommandBuilder()
  .setName("set")
  .setDescription("Get info about a user or a server!")
  .addSubcommand((wlc) =>
    wlc
      .setName("welcome_channel")
      .setDescription("Set The Welcome Channel")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to greet new users in ;)")
        .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("leave_channel")
      .setDescription("Set the leave channel")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to declare leaving users (;")
        .setRequired(true)
      )
  )
  .addSubcommand((img) =>
    img
      .setName("background_image_url")
      .setDescription(
        "Set the leave image url of leaving and joining member cards"
      )
      .addStringOption((option) =>
        option
          .setName("url")
          .setDescription(
            "The url of your server's welcome and leave card images"
        )
        .setRequired(true)
      )
)
   .addSubcommand((wlm) =>
    wlm
      .setName("welcome_message")
      .setDescription(
        "Set the welcome message"
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription(
            "The message"
        )
        .setRequired(true)
      )
)
  .addSubcommand((wlm) =>
    wlm
      .setName("leave_message")
      .setDescription(
        "Set the leave message"
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription(
            "The message"
        )
        .setRequired(true)
      )
  )
  .toJSON(),


  (async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: [command],
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  } finally {
    console.log(
      'If there were no error the message before this should be\n "Successfully reloaded application (/) commands."'
    );
  }
})();
