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

module.exports = async function (oldMember, newMember) {
  let guild = newMember.guild;

  let mongoGuild = await guildsCollection.findOne({ _id: guild.id });

  if (mongoGuild == null) {
    globals.warn(`Guild settings not configured for **${guild.name}**.`);
    return;
  }

  if (
    !oldMember.roles.cache.has(mongoGuild.verifiedRole) &&
    newMember.roles.cache.has(mongoGuild.verifiedRole)
  ) {
    let mongoStudent = await studentsCollection.findOne({ _id: newMember.id });
    if (mongoStudent == null) {
      globals.warn(
        `In **${guild.name}**, ${newMember.user.tag} (\`${newMember.id}\`) was just given the verified role despite being unverified. This is a potential security hazard.`
      );
    }
  } else if (
    !oldMember.roles.cache.has(mongoGuild.secondaryRole) &&
    newMember.roles.cache.has(mongoGuild.secondaryRole)
  ) {
    let mongoStudent = await studentsCollection.findOne({ _id: newMember.id });
    if (mongoStudent == null) {
      globals.warn(
        `In **${guild.name}**, ${newMember.user.tag} (\`${newMember.id}\`) was just given the secondary role despite being unverified. This is a potential security hazard.`
      );
    }
  }
};
