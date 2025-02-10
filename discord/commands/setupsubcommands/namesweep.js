const { database, discordBot } = require('../../../index');

module.exports = async function (interaction) {
  discordBot.respond(
    interaction,
    true,
    '',
    '✅ Resetting nicknames of all members...',
  );

  // Fetch guild from guildsCollection
  const mongoGuild = await database.guildsCollection.findOne({
    _id: interaction.guild.id,
  });

  // Check if guild is a club server
  const isClubGuild = mongoGuild.clubName && mongoGuild.enrollmentLink;

  await interaction.guild.members.cache.each(async (member) => {
    // Fetch student from studentsCollection
    let mongoStudent = await database.studentsCollection.findOne({
      _id: member.id,
    });

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

  discordBot.guild(interaction.guild, 'Server nameswept.');
};
