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
} = require("../../../index");

module.exports = async function (interaction) {
  if (interaction.user.id != globals.yusufID)
    return globals.respond(
      interaction,
      false,
      "❌ Unauthorized",
      "You must be an authorized OneKey developer to use this subcommand."
    );

  let stamp = await interaction.channel.send({
    embeds: [
      {
        description:
          "🔒 This server is secured with [VLC OneKey](https://vlconekey.com/info).",
        footer: {
          iconURL: discordClient.user.displayAvatarURL(),
          text: "VLC OneKey | Verified once, verified forever.",
        },
        color: 2201331,
      },
    ],
  });
  globals.respond(interaction, true, "", `✅ Stamp created at ${stamp.url}.`);
  globals.guild(interaction.guild, `Stamp created at ${stamp.url}.`);
};
