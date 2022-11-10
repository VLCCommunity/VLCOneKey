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

module.exports = async function (interaction) {
  if (
    interaction.user.id != globals.yusufID &&
    interaction.user.id != globals.ibrahimID
  )
    return globals.respond(
      interaction,
      false,
      '❌ Unauthorized',
      'You must be an authorized OneKey developer to use this subcommand.'
    );

  let mongoStudent = await studentsCollection.findOne({
    _id: interaction.options.getString('id'),
  });

  if (!mongoStudent)
    return globals.respond(interaction, false, '', '❌ Invalid user ID.');

  await globals.respond(
    interaction,
    false,
    '⚠️ Warning',
    `Are you sure you want to unverify <@${mongoStudent._id}> (**${
      mongoStudent.name
    }** / \`${mongoStudent.email}\` / \`${
      mongoStudent._id
    }\`)? The user verified <t:${Math.round(
      mongoStudent.timestamp / 1000
    )}:R>.\nType 'Yes.' within 5 seconds to confirm.`
  );

  let filter = (m) =>
    m.author.id == interaction.user.id && m.content === 'Yes.';
  let confirmation = await interaction.channel.awaitMessages({
    filter,
    max: 4,
    time: 5_000,
  });
  if (confirmation.toJSON().length == 0)
    return globals.respondAgain(
      interaction,
      false,
      '',
      '❌ Confirmation failed.'
    );

  try {
    await discordClient.guilds.cache.each(async (guild) => {
      if (guild.members.cache.has(mongoStudent._id)) {
        let member = await guild.members.fetch(mongoStudent._id);

        let mongoGuild = await guildsCollection.findOne({ _id: guild.id });
        if (!mongoGuild)
          return globals.warn(
            `Guild settings not configured for **${guild.name}**.`
          );

        try {
          let verifiedRole = await member.guild.roles.fetch(
            mongoGuild.verifiedRole
          );
          await member.roles.remove(
            verifiedRole,
            '❌ Unverified with VLC OneKey.'
          );
        } catch (error) {
          globals.error(
            `Unable to remove verified role from <@${mongoStudent._id}> (\`${mongoStudent._id}\`) in **${guild.name}**.\n\`\`\`\n${error}\n\`\`\``
          );
        }

        try {
          await member.setNickname(
            '❌ Inactive Account',
            '❌ Unverified with VLC OneKey.'
          );
          await member.kick('❌ Unverified with VLC OneKey.');
        } catch {
          // Cannot set nickname/kick
        }
      }
    });

    await studentsCollection.deleteOne({ _id: mongoStudent._id });

    try {
      let user = await discordClient.users.fetch(mongoStudent._id);
      await user.send({
        embeds: [
          {
            title: '❌ Unverified',
            description: `Your account has been unverified..`,
            footer: {
              iconURL: discordClient.user.displayAvatarURL(),
              text: 'VLC OneKey | Verified once, verified forever.',
            },
            color: 15548997,
          },
        ],
      });
    } catch {
      // Cannot DM user
    }

    console.log(`🔓 Unverified ${mongoStudent._id}`);

    let verifyLogsChannel = await discordClient.channels.fetch(
      globals.verifyLogsChannelID
    );
    verifyLogsChannel.send({
      embeds: [
        {
          title: '❌ Unverified',
          description: `<@${mongoStudent._id}> (**${mongoStudent.name}** / \`${mongoStudent.email}\` / \`${mongoStudent._id}\`) has been successfully unverified.`,
          footer: {
            iconURL: discordClient.user.displayAvatarURL(),
            text: 'VLC OneKey | Verified once, verified forever.',
          },
          color: 15548997,
        },
      ],
    });

    let commLogsChannel = await discordClient.channels.fetch(
      globals.commLogsChannelID
    );
    commLogsChannel.send(
      `❌ <@${mongoStudent._id}> (**${mongoStudent.name}** / \`${mongoStudent.email}\` / \`${mongoStudent._id}\`) has been unverified.`
    );

    globals.respondAgain(
      interaction,
      true,
      '',
      `✅ Successfully unverified <@${mongoStudent._id}> (**${mongoStudent.name}** / \`${mongoStudent.email}\` / \`${mongoStudent._id}\`).`
    );
  } catch (error) {
    globals.respondAgain(
      interaction,
      false,
      '',
      `❌ Unable to unverify user.\n\`\`\`\n${error}\n\`\`\``
    );
  }
};
