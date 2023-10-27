/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const { discordClient } = require('../index');

const verifyLogsChannelID = '924353379302527016';
const errorLogsChannelID = '953539238534713364';
const guildLogsChannelID = '953539282591682560';
const userLogsChannelID = '1081702211702247616';
const commLogsChannelID = '884681312445812746';

const yusufID = '218065068875579393'; // Yusuf Rahman
const ibrahimID = '760542510975156285'; // Ibrahim Siddique
const ahsenID = '835179046215221248'; // Ahsen Khan

const developers = [yusufID, ibrahimID, ahsenID];

const respond = async function (interaction, success, title, description = '') {
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
          iconURL: discordClient.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: color,
      },
    ],
    ephemeral: true,
  });
};

const respondAgain = async function (
  interaction,
  success,
  title,
  description = '',
) {
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
          iconURL: discordClient.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: color,
      },
    ],
    ephemeral: true,
  });
};

const warn = async function (description) {
  let channel = await discordClient.channels.fetch(errorLogsChannelID);

  channel.send({
    embeds: [
      {
        title: '⚠ Warning',
        description: description,
        footer: {
          iconURL: discordClient.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: 16705372,
      },
    ],
  });
};

const error = async function (description) {
  let channel = await discordClient.channels.fetch(errorLogsChannelID);

  channel.send({
    embeds: [
      {
        title: '❌ Error',
        description: description,
        footer: {
          iconURL: discordClient.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: 15548997,
      },
    ],
  });
};

const guild = async function (guild, description) {
  let channel = await discordClient.channels.fetch(guildLogsChannelID);

  channel.send({
    embeds: [
      {
        author: {
          name: guild.name,
          iconURL: guild.iconURL(),
        },
        description: description,
        footer: {
          iconURL: discordClient.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: 2201331,
      },
    ],
  });
};

module.exports = {
  verifyLogsChannelID,
  errorLogsChannelID,
  guildLogsChannelID,
  userLogsChannelID,
  commLogsChannelID,
  developers,
  respond,
  respondAgain,
  warn,
  error,
  guild,
};
