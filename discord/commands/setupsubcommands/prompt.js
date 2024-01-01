const { discordBot } = require('../../../index');

module.exports = async function (interaction) {
  await interaction.channel.send({
    embeds: [
      {
        title: '🔓 Verification',
        description:
          'To gain full access to the server, please verify your identity as a VLC student by clicking `Verify` below. \n\nIf you encounter any issues, ping a server administator.',
        footer: {
          iconURL: discordBot.client.user.displayAvatarURL(),
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
            url: 'https://vlconekey.com/',
          },
        ],
      },
    ],
  });
  await discordBot.respond(
    interaction,
    true,
    '',
    '✅ Verification prompt created.',
  );
  discordBot.guild(interaction.guild, 'Verification prompt created.');
};
