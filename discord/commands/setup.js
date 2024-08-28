const { discordBot } = require('../../index');
const { PermissionsBitField } = require('discord.js');

module.exports = async function (interaction) {
  if (
    interaction.memberPermissions.has(
      PermissionsBitField.Flags.Administrator,
    ) ||
    discordBot.developers.includes(interaction.user.id)
  ) {
    try {
      let executeSubcommand = require(
        `./setupsubcommands/${interaction.options.getSubcommand()}`,
      );
      await executeSubcommand(interaction);
    } catch (error) {
      console.log(
        `❌ Unable to execute ${interaction.options.getSubcommand()} setup subcommand. \n` +
          error,
      );
    }
  } else {
    await discordBot.respond(
      interaction,
      false,
      '❌ Insufficient Permissions',
      'You must be a server administator to use setup commands.',
    );
  }
};
