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
} = require('../../../index');

module.exports = async function (interaction) {
  await interaction.channel.send({
    embeds: [
      {
        title: '🔓 Verification',
        description:
          'To gain full access to the server, please verify your identity as a VLC student by clicking `Verify` below. \n\nIf you encounter any issues, ping a server administator.',
        footer: {
          iconURL: discordClient.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: 2201331,
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
  });
  await globals.respond(
    interaction,
    true,
    '',
    '✅ Verification prompt created.'
  );
  globals.guild(interaction.guild, 'Verification prompt created.');
};
