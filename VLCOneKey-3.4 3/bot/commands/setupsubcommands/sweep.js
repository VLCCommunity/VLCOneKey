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
  globals.respond(interaction, true, '', '✅ Checking all members...');

  let mongoGuild = await guildsCollection.findOne({
    _id: interaction.guild.id,
  });
  if (mongoGuild == null) {
    globals.warn(`Guild settings not configured for **${guild.name}**.`);
    return;
  }

  let verifiedRole = await interaction.guild.roles.fetch(
    mongoGuild.verifiedRole
  );

  await interaction.guild.members.cache.each(async (member) => {
    let mongoStudent = await studentsCollection.findOne({ _id: member.id });
    if (mongoStudent) {
      await member.roles.add(verifiedRole);
      try {
        await member.setNickname(
          mongoStudent.name,
          '✅ Verified with VLC OneKey.'
        );
      } catch {
        // Can't change nickname
      }
    } else {
      await member.roles.remove(verifiedRole);
    }
  });
};
