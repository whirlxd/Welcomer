import {
  Client as welcomer,
  Intents,
  MessageAttachment,
  Permissions as perms,
} from "discord.js";
import pkg from "quick.db";
const { get, set } = pkg;
import * as canvas from "discord-canvas";
import isUrl from "is-url-superb";
import dotenv from "dotenv";
dotenv.config();
const client = new welcomer({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand) {
    if (interaction.commandName == "set") {
      if (interaction.options.getSubcommand() == "welcome_channel") {
        if (!interaction.member.permissions.has(perms.FLAGS.MANAGE_CHANNELS)) {
          return interaction.reply(
            "You don't have the permission to do that! [Manage Channels Perm Require]"
          );
        }

        const channel = interaction.options.getChannel("channel"); //marked as any since im gonna test it's type with the snowflake of guild_Text
        if (channel.type !== "GUILD_TEXT") {
          interaction.reply(
            "Pls make sure the provided channel is a text channel"
          );
          return;
        } else {
          set(`welcomechannel_${interaction.guild.id}`, channel.id);
          let a = get(`welcomechannel_${interaction.guild.id}`);
          interaction.reply(`Now Set <#${a}> as Welcome Channel `);
        }
      } else if (interaction.options.getSubcommand() == "leave_channel") {
        if (!interaction.member.permissions.has(perms.FLAGS.MANAGE_CHANNELS)) {
          return interaction.reply(
            "You don't have the permission to do that! [Manage Channels Perm Require]"
          );
        }
        const channel = interaction.options.getChannel("channel");
        if (channel.type !== "GUILD_TEXT") {
          interaction.reply(
            "Pls make sure the provided channel is a text channel"
          );
          return;
        } else {
          set(`leavechannel_${interaction.guild.id}`, channel.id);
          let a = get(`leavechannel_${interaction.guild.id}`);
          interaction.reply(`Now Set <#${a}> as Leave Channel `);
        }
      } else if (interaction.options.getSubcommand() == "welcome_message") {
        if (!interaction.member.permissions.has(perms.FLAGS.MANAGE_CHANNELS)) {
          return interaction.reply(
            "You don't have the permission to do that! [Manage Channels Perm Require]"
          );
        }
        const msg = interaction.options.getString("message");
        set(`welcome_${interaction.guild.id}`, msg);
        let a = get(`welcome_${interaction.guild.id}`);
        interaction.reply(`Now Set \`${a}\` as Welcome Message `);
      } else if (interaction.options.getSubcommand() == "leave_message") {
        if (!interaction.member.permissions.has(perms.FLAGS.MANAGE_CHANNELS)) {
          return interaction.reply(
            "You don't have the permission to do that! [Manage Channels Perm Require]"
          );
        }
        const msg = interaction.options.getString("message");
        set(`leave_${interaction.guild.id}`, msg);
        let a = get(`leave_${interaction.guild.id}`);
        interaction.reply(`Now Set \`${a}\` as Leave Message `);
      } else if (
        interaction.options.getSubcommand() == "background_image_url"
      ) {
        if (!interaction.member.permissions.has(perms.FLAGS.MANAGE_CHANNELS)) {
          return interaction.reply(
            "You don't have the permission to do that! [Manage Channels Perm Require]"
          );
        }
        const url = interaction.options.getString("url");
        isUrl(url)
          ? set(`image_${interaction.guild.id}`, url) +
            interaction.reply(`Succesfully set ${url} as image url`)
          : interaction.reply(
              "Pls make sure the provided url is a valid image url"
            );
      }
    }
  }
});
client.on("ready", () => {
  console.log("Welcomer is in a fit shape");
});
client.on("guildMemberAdd", async (member) => {
  const bgurl =
    get(`image_${member.guild.id}`) ??
    "https://cdn.discordapp.com/attachments/848946480319823903/883254544446939166/unknown.png";

  const channel = member.guild.channels.cache.get(
    get(`welcomechannel_${member.guild.id}`)
  );
  const wlcm = await new canvas.Welcome()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setMemberCount(member.guild.memberCount + 1)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ format: "png" }))
    .setColor("border", "#000000")
    .setColor("username-box", "#000000")
    .setColor("discriminator-box", "#000000")
    .setColor("title", "#00ffff")
    .setText("message", "welcome to {server}")
    .setText("member-count", "{count}nd member ")
    .setBackground(bgurl)
    .toAttachment();
  const attachment = new MessageAttachment(wlcm.toBuffer(), "bye.png");
  await channel.send(get(`welcome_${member.guild.id}`));
  await channel.send({ files: [{ attachment: attachment.attachment }] });
});
client.on("guildMemberRemove", async (member) => {
  const bgurl =
    get(`image_${member.guild.id}`) ??
    `https://cdn.discordapp.com/attachments/848946480319823903/883254544446939166/unknown.png`;
  const channel = member.guild.channels.cache.get(
    get(`leavechannel_${member.guild.id}`)
  );
  const wlcm = await new canvas.Goodbye()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setMemberCount(member.guild.memberCount + 1)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ format: "png" }))
    .setColor("border", "#000000")
    .setColor("username-box", "#000000")
    .setColor("discriminator-box", "#000000")
    .setColor("title", "#ff0000")
    .setText("message", "leaving from {server}")
    .setText("member-count", "{count}nd member ")
    .setBackground(bgurl)
    .toAttachment();
  const attachment = new MessageAttachment(wlcm.toBuffer(), "bye.png");
  await channel.send(get(`leave_${member.guild.id}`));
  await channel.send({ files: [{ attachment: attachment.attachment }] });
});
client.on("messageCreate", (message) => {
  if (message.content == "whirliscool") {
    client.emit("guildMemberAdd", message.member);
  } else if (message.content == "whirll") {
    client.emit("guildMemberRemove", message.member);
  }
});
client.login(process.env.TOKEN);
