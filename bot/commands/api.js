/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const { discordClient, globals } = require("../../index");

module.exports = async function (interaction) {
  if (globals.developers.includes(interaction.user.id)) {
    try {
      require(`./apisubcommands/${interaction.options.getSubcommand()}`)(
        interaction
      );
    } catch (error) {
      console.log(
        `❌ Unable to execute ${interaction.options.getSubcommand()} api subcommand. \n` +
          error
      );
    }
  } else {
    await globals.respond(
      interaction,
      false,
      "❌ Unauthorized",
      "You must be an authorized OneKey developer to use this command."
    );
  }
};
