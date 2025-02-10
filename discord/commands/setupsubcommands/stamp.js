const { discordBot } = require('../../../index');

module.exports = async function (interaction) {
  if (!discordBot.developers.includes(interaction.user.id))
    return discordBot.respond(
      interaction,
      false,
      '❌ Unauthorized',
      'You must be an authorized OneKey developer to use this subcommand.',
    );

  let stamp = await interaction.channel.send({
    embeds: [
      {
        description:
          '🔒 This server is secured with [VLC OneKey](https://vlconekey.com/info).',
        footer: {
          iconURL: discordBot.client.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: 2201331,
      },
    ],
  });
  discordBot.respond(
    interaction,
    true,
    '',
    `✅ Stamp created at ${stamp.url}.`,
  );
  discordBot.guild(interaction.guild, `Stamp created at ${stamp.url}.`);
};
