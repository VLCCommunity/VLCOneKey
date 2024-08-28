const { database, discordBot } = require('../../../index');

module.exports = async function (interaction) {
  discordBot.respond(interaction, true, '', '✅ Checking all members...');

  let mongoGuild = await database.guildsCollection.findOne({
    _id: interaction.guild.id,
  });
  if (mongoGuild == null) {
    discordBot.warn(`Guild settings not configured for **${guild.name}**.`);
    return;
  }

  let verifiedRole = await interaction.guild.roles.fetch(
    mongoGuild.verifiedRole,
  );

  await interaction.guild.members.cache.each(async (member) => {
    let mongoStudent = await database.studentsCollection.findOne({
      _id: member.id,
    });
    if (mongoStudent) {
      await member.roles.add(verifiedRole);
      try {
        await member.setNickname(
          mongoStudent.name,
          '✅ Verified with VLC OneKey.',
        );
      } catch {
        // Can't change nickname
      }
    } else {
      await member.roles.remove(verifiedRole);
    }
  });
};
