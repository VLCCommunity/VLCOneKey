const { discordBot, database } = require('..');

module.exports = async function (discordID, vlcName) {
  /* When a user verifies through the web interface, this function is called in index.js, for example:
  const userVerify = require('.bot/userVerify');
  userVerify(the Discord user ID, the VLC full name);

  IMPORTANT: The function assumes that discordBot.client is a valid client, discordID is a valid Discord user ID, and vlcName is a valid string.
  */
  const verifyLogsChannel = await discordBot.client.channels.fetch(
    discordBot.verifyLogsChannelID,
  );
  const commLogsChannel = await discordBot.client.channels.fetch(
    discordBot.commLogsChannelID,
  );

  // =================== DM Notification ===================

  try {
    let user = await discordBot.client.users.fetch(discordID);
    await user.send({
      embeds: [
        {
          title: '✅ Verified',
          description: `You have been successfully verified as **${vlcName}**.`,
          footer: {
            iconURL: discordBot.client.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 2201331,
        },
      ],
    });
  } catch {
    // Cannot DM user
  }

  // ========= Adding VLC role in every server =========

  discordBot.client.guilds.cache.each(async (guild) => {
    if (guild.members.cache.has(discordID)) {
      let member = await guild.members.fetch(discordID);

      try {
        await member.setNickname(vlcName, '✅ Verified with VLC OneKey.');
      } catch {
        // Cannot set nickname
      }

      let mongoGuild = await database.guildsCollection.findOne({
        _id: guild.id,
      });
      if (!mongoGuild)
        return discordBot.warn(
          `Guild settings not configured for **${guild.name}**.`,
        );

      try {
        let verifiedRole = await member.guild.roles.fetch(
          mongoGuild.verifiedRole,
        );
        await member.roles.add(verifiedRole, '✅ Verified with VLC OneKey.');
      } catch (error) {
        discordBot.error(
          `Unable to add verified role to <@${discordID}> (\`${discordID}\`) in **${guild.name}**.\n\`\`\`\n${error}\n\`\`\``,
        );
      }
    }
  });

  // =================== Logging ===================

  verifyLogsChannel.send({
    embeds: [
      {
        title: '✅ Verification',
        description: `<@${discordID}> (\`${discordID}\`) has successfully verified as **${vlcName}**.`,
        footer: {
          iconURL: discordBot.client.user.displayAvatarURL(),
          text: 'VLC OneKey | Verified once, verified forever.',
        },
        color: 5763719,
      },
    ],
  });

  commLogsChannel.send(
    `✅ <@${discordID}> (\`${discordID}\`) has successfully verified as **${vlcName}**.`,
  );
};
