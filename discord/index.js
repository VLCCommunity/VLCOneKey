const { Client, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const { database } = require('../index');

class DiscordBot {
  constructor(token) {
    this.token = token;

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.verifyLogsChannelID = '924353379302527016';
    this.errorLogsChannelID = '953539238534713364';
    this.guildLogsChannelID = '953539282591682560';
    this.userLogsChannelID = '1081702211702247616';
    this.commLogsChannelID = '884681312445812746';

    this.yusufID = '218065068875579393';
    this.ahsenID = '835179046215221248';
    this.developers = [this.yusufID, this.ahsenID, '940085566354104330'];
  }

  async loadEvents() {
    const eventsPath = join(__dirname, 'events');
    readdirSync(eventsPath).forEach((eventFile) => {
      const eventName = eventFile.split('.')[0]; // Extract event name
      const eventHandler = require(join(eventsPath, eventFile));
      this.client.on(eventName, eventHandler.bind(null, this.client));
    });
  }

  async loadCommands() {
    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        const commandFilePath = `./commands/${interaction.commandName}`;
        try {
          const executeCommand = require(commandFilePath);
          await executeCommand(interaction);
        } catch (error) {
          console.error(
            `Failed to execute command ${interaction.commandName}:`,
            error,
          );
          interaction.reply({
            content: 'There was an error executing that command!',
            ephemeral: true,
          });
        }
      }
    });
  }

  async updateStatus() {
    const verifiedCount = await database.getVerifiedCount();
    const status = `${verifiedCount} verified VLCers!`;
    this.client.user.setActivity({
      name: status,
      type: 3,
    });
    console.log('Status updated: Watching ' + status);
  }

  async initialize(onSuccess) {
    await this.loadEvents();
    await this.loadCommands();
    await this.client.login(this.token);

    onSuccess();

    this.updateStatus();
    setInterval(() => {
      this.updateStatus();
    }, 86400000); // 1 day
  }

  async respond(interaction, success, title, description = '') {
    let color = 15548997;
    if (success) {
      color = 5763719;
    }

    await interaction.reply({
      embeds: [
        {
          title: title,
          description: description,
          footer: {
            iconURL: this.client.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: color,
        },
      ],
      ephemeral: true,
    });
  }

  async respondAgain(interaction, success, title, description = '') {
    let color = 15548997;
    if (success) {
      color = 5763719;
    }

    await interaction.followUp({
      embeds: [
        {
          title: title,
          description: description,
          footer: {
            iconURL: this.client.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: color,
        },
      ],
      ephemeral: true,
    });
  }

  async warn(description) {
    let channel = await this.client.channels.fetch(this.errorLogsChannelID);

    channel.send({
      embeds: [
        {
          title: '⚠ Warning',
          description: description,
          footer: {
            iconURL: this.client.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 16705372,
        },
      ],
    });
  }

  async error(description) {
    let channel = await this.client.channels.fetch(this.errorLogsChannelID);

    channel.send({
      embeds: [
        {
          title: '❌ Error',
          description: description,
          footer: {
            iconURL: this.client.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 15548997,
        },
      ],
    });
  }

  async guild(guild, description) {
    let channel = await this.client.channels.fetch(this.guildLogsChannelID);

    channel.send({
      embeds: [
        {
          author: {
            name: guild.name,
            iconURL: guild.iconURL(),
          },
          description: description,
          footer: {
            iconURL: this.client.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 2201331,
        },
      ],
    });
  }
}

module.exports = DiscordBot;
