const { database, discordBot } = require('../../index');

module.exports = async function (client, member) {
  let mongoStudent = await database.studentsCollection.findOne({
    _id: member.id,
  });

  if (mongoStudent == null) return;

  let mongoGuild = await database.guildsCollection.findOne({
    _id: member.guild.id,
  });

  const isClubGuild = mongoGuild.clubName && mongoGuild.enrollmentLink;

  // ======== Sets nickname ========

  // Rename member if privacy mode disabled or is club server
  if (isClubGuild || !mongoStudent.privacy) {
    try {
      await member.setNickname(
        mongoStudent.name,
        '✅ Verified with VLC OneKey.',
      );
    } catch {
      // Cannot change nickname
    }
  }

  // ======== Adds role ========

  if (mongoGuild == null) {
    discordBot.warn(
      `Guild settings not configured for **${member.guild.name}**.`,
    );
    return;
  }

  try {
    let verifiedRole = await member.guild.roles.fetch(mongoGuild.verifiedRole);
    await member.roles.add(verifiedRole, '✅ Verified with VLC OneKey.');
  } catch (error) {
    discordBot.error(
      `Unable to add verified role to <@${member.user.id}> (\`${member.user.id}\`) in **${member.guild.name}**.\n\`\`\`\n${error}\n\`\`\``,
    );
  }

  // ======== Sends DM notification ========

  try {
    await member.send({
      embeds: [
        {
          description: `You have been automatically verified in **${member.guild.name}**.`,
          footer: {
            iconURL: client.user.displayAvatarURL(),
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

  if (!isClubGuild) return;

  try {
    await member.send({
      embeds: [
        {
          title: 'Club Enrollment',
          description: `Please enroll in the club's Canvas course if you have not already done so.`,
          footer: {
            iconURL: client.user.displayAvatarURL(),
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
