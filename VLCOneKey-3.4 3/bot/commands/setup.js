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

module.exports = async function (interaction) {
  if (
    interaction.memberPermissions.has('ADMINISTRATOR') ||
    interaction.user.id == globals.yusufID
  ) {
    try {
      let executeSubcommand = require(`./setupsubcommands/${interaction.options.getSubcommand()}`);
      await executeSubcommand(interaction);
    } catch (error) {
      console.log(
        `❌ Unable to execute ${interaction.options.getSubcommand()} setup subcommand. \n` +
          error
      );
    }
  } else {
    await globals.respond(
      interaction,
      false,
      '❌ Insufficient Permissions',
      'You must be a server administator to use setup commands.'
    );
  }
};
