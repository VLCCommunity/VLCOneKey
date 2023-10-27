/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const {
  studentsCollection,
  guildsCollection,
  globals,
} = require('../../../index');

module.exports = async function (interaction) {
  globals.respond(
    interaction,
    true,
    '',
    '✅ Resetting nicknames of all members...',
  );

  // Fetch guild from guildsCollection
  const mongoGuild = await guildsCollection.findOne({
    _id: interaction.guild.id,
  });

  // Check if guild is a club server
  const isClubGuild = mongoGuild.clubName && mongoGuild.enrollmentLink;

  await interaction.guild.members.cache.each(async (member) => {
    // Fetch student from studentsCollection
    let mongoStudent = await studentsCollection.findOne({ _id: member.id });

    // if student is verified and (privacy mode disabled or is club server)
    if (mongoStudent && (isClubGuild || !mongoStudent.privacy)) {
      try {
        await member.setNickname(
          mongoStudent.name,
          '✅ Verified with VLC OneKey.',
        );
      } catch {
        // Can't change nickname
      }
    }
  });

  globals.guild(interaction.guild, 'Server nameswept.');
};
