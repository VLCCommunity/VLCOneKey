/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const {
  discordClient,
  studentsCollection,
  guildsCollection,
  globals,
} = require('../../index');
const { PermissionsBitField } = require('discord.js');

module.exports = async function (interaction) {
  const mongoStudent = await studentsCollection.findOne({
    _id: interaction.user.id,
  });

  // Fetch guild from guildsCollection
  const mongoGuild = await guildsCollection.findOne({
    _id: interaction.guild.id,
  });

  // Check if guild is a club server
  const isClubGuild = mongoGuild.clubName && mongoGuild.enrollmentLink;

  // Check for another user option
  const anotherUser =
    interaction.options.data.length > 0 &&
    interaction.options.data[0].user.id != interaction.user.id;

  // If user calling the command is verified
  if (mongoStudent) {
    if (!anotherUser) {
      await interaction.reply({
        embeds: [
          {
            title: '✅ You are verified.',
            fields: [
              {
                name: 'Name',
                value: mongoStudent.name,
                inline: true,
              },
              {
                name: 'Email',
                value: mongoStudent.email,
                inline: true,
              },
              {
                name: 'Date Verified',
                value: `<t:${Math.round(mongoStudent.timestamp / 1000)}:R>`,
                inline: true,
              },
            ],
            footer: {
              iconURL: discordClient.user.displayAvatarURL(),
              text: 'VLC OneKey | Verified once, verified forever.',
            },
            color: 5763719,
          },
        ],
        ephemeral: true,
      });
    } else {
      let otherMongoStudent = await studentsCollection.findOne({
        _id: interaction.options.data[0].user.id,
      });

      if (otherMongoStudent != null) {
        // Other student has privacy mode enabled and not club guild and not server administrator
        if (
          !isClubGuild &&
          otherMongoStudent.privacy &&
          !interaction.memberPermissions.has(
            PermissionsBitField.Flags.Administrator
          )
        ) {
          return await globals.respond(
            interaction,
            false,
            '❌ Insufficient Permissions',
            'Only server administators can see information about this user.'
          );
        }

        await interaction.reply({
          embeds: [
            {
              title: `✅ ${interaction.options.data[0].user.tag} is verified.`,
              fields: [
                {
                  name: 'Name',
                  value: otherMongoStudent.name,
                  inline: true,
                },
                {
                  name: 'Email',
                  value: otherMongoStudent.email,
                  inline: true,
                },
                {
                  name: 'Date Verified',
                  value: `<t:${Math.round(
                    otherMongoStudent.timestamp / 1000
                  )}:R>`,
                  inline: true,
                },
              ],
              footer: {
                iconURL: discordClient.user.displayAvatarURL(),
                text: 'VLC OneKey | Verified once, verified forever.',
              },
              color: 5763719,
            },
          ],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [
            {
              title: `❌ ${interaction.options.data[0].user.tag} is not verified.`,
              footer: {
                iconURL: discordClient.user.displayAvatarURL(),
                text: 'VLC OneKey | Verified once, verified forever.',
              },
              color: 15548997,
            },
          ],
          ephemeral: true,
        });
      }
    }
  } else {
    if (!anotherUser) {
      await interaction.reply({
        embeds: [
          {
            title: `❌ You are not verified.`,
            description:
              'Click `Verify` to verify your identity as a VLC student.',
            footer: {
              iconURL: discordClient.user.displayAvatarURL(),
              text: 'VLC OneKey | Verified once, verified forever.',
            },
            color: 15548997,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Verify',
                style: 5,
                url: 'http://vlconekey.com/',
              },
            ],
          },
        ],
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        embeds: [
          {
            title: `❌ You must be verified to check the verification status of other users.`,
            description:
              'Click `Verify` to verify your identity as a VLC student.',
            footer: {
              iconURL: discordClient.user.displayAvatarURL(),
              text: 'VLC OneKey | Verified once, verified forever.',
            },
            color: 15548997,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Verify',
                style: 5,
                url: 'http://vlconekey.com/',
              },
            ],
          },
        ],
        ephemeral: true,
      });
    }
  }
};
