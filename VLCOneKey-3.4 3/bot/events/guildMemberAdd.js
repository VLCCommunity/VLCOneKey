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

module.exports = async function (member) {
  let mongoStudent = await studentsCollection.findOne({ _id: member.id });

  if (mongoStudent == null) return;

  // ======== Sets nickname ========

  try {
    await member.setNickname(mongoStudent.name, '✅ Verified with VLC OneKey.');
  } catch {
    // Cannot change nickname
  }

  // ======== Adds role ========

  let mongoGuild = await guildsCollection.findOne({ _id: member.guild.id });

  if (mongoGuild == null) {
    globals.warn(`Guild settings not configured for **${member.guild.name}**.`);
    return;
  }

  try {
    let verifiedRole = await member.guild.roles.fetch(mongoGuild.verifiedRole);
    await member.roles.add(verifiedRole, '✅ Verified with VLC OneKey.');
  } catch (error) {
    globals.error(
      `Unable to add verified role to <@${member.user.id}> (\`${member.user.id}\`) in **${member.guild.name}**.\n\`\`\`\n${error}\n\`\`\``
    );
  }

  // ======== Sends DM notification ========

  try {
    member.send({
      embeds: [
        {
          description: `You have been automatically verified in **${member.guild.name}**.`,
          footer: {
            iconURL: discordClient.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 2201331,
        },
      ],
    });
  } catch {
    // Cannot send DM notification
  }

  // ======== Sends DM notice about club enrollement for club servers ========

  if (!mongoGuild.clubName && !mongoGuild.enrollmentLink) return;
  try {
    member.send({
      embeds: [
        {
          title: 'Club Enrollment',
          description: `Please enroll in the club's Canvas course if you have not already done so.`,
          footer: {
            iconURL: discordClient.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 2201331,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Enroll',
              style: 5,
              url: mongoGuild.enrollmentLink,
            },
          ],
        },
      ],
    });
  } catch {
    // Cannot send DM notice
  }
};
