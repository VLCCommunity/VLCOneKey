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
  globals.respond(
    interaction,
    true,
    "",
    "✅ Resetting nicknames of all members..."
  );

  await interaction.guild.members.cache.each(async (member) => {
    let mongoStudent = await studentsCollection.findOne({ _id: member.id });
    if (mongoStudent) {
      try {
        await member.setNickname(
          mongoStudent.name,
          "✅ Verified with VLC OneKey."
        );
      } catch {
        // Can't change nickname
      }
    }
  });

  globals.guild(interaction.guild, "Server nameswept.");
};
