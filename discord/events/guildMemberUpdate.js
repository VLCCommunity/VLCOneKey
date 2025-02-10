const { database, discordBot } = require('../../index');

module.exports = async function (_client, oldMember, newMember) {
  let guild = newMember.guild;

  let mongoGuild = await database.guildsCollection.findOne({ _id: guild.id });

  if (mongoGuild == null) {
    discordBot.warn(`Guild settings not configured for **${guild.name}**.`);
    return;
  }

  if (
    !oldMember.roles.cache.has(mongoGuild.verifiedRole) &&
    newMember.roles.cache.has(mongoGuild.verifiedRole)
  ) {
    let mongoStudent = await database.studentsCollection.findOne({
      _id: newMember.id,
    });
    if (mongoStudent == null) {
      discordBot.warn(
        `In **${guild.name}**, ${newMember.user.tag} (\`${newMember.id}\`) was just given the verified role despite being unverified. This is a potential security hazard.`,
      );
    }
  } else if (
    !oldMember.roles.cache.has(mongoGuild.secondaryRole) &&
    newMember.roles.cache.has(mongoGuild.secondaryRole)
  ) {
    let mongoStudent = await database.studentsCollection.findOne({
      _id: newMember.id,
    });
    if (mongoStudent == null) {
      discordBot.warn(
        `In **${guild.name}**, ${newMember.user.tag} (\`${newMember.id}\`) was just given the secondary role despite being unverified. This is a potential security hazard.`,
      );
    }
  }
};
