/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const { discordClient, studentsCollection, globals } = require("../../index");

module.exports = async function (interaction) {
  const privacyEnabled = interaction.options.data[0].value === "enable";

  let mongoGuild = await guildsCollection.findOne({ _id: interaction.guild.id });

  const isClubGuild = mongoGuild.clubName && mongoGuild.enrollmentLink;

  // fetch user from database
  let mongoStudent = await studentsCollection.findOne({
    _id: interaction.user.id,
  });

  // if student not verified
  if (!mongoStudent) {
    return await interaction.reply({
      embeds: [
        {
          title: `❌ You are not verified.`,
          description:
            "Click `Verify` to verify your identity as a VLC student.",
          footer: {
            iconURL: discordClient.user.displayAvatarURL(),
            text: "VLC OneKey | Verified once, verified forever.",
          },
          color: 15548997,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Verify",
              style: 5,
              url: "http://vlconekey.com/",
            },
          ],
        },
      ],
      ephemeral: true,
    });
  }

  // Update 'privacy' value in database
  if (mongoStudent.privacy !== privacyEnabled) {
    await studentsCollection.updateOne(
      {
        _id: interaction.user.id,
      },
      {
        $set: {
          privacy: privacyEnabled,
        },
      }
    );
  }

  // Reset member nickname if privacy set to enabled and not club guild
  if (
    privacyEnabled &&
    !isClubGuild &&
    interaction.member.nickname == mongoStudent.name
  ) {
    interaction.member.setNickname("");
  }

  // Respond to interaction
  await globals.respond(
    interaction,
    true,
    "✅ Settings Updated",
    `Privacy mode is now ${interaction.options.data[0].value}d.`
  );

  // Fetch user logs channel
  let userLogsChannel = await discordClient.channels.fetch(
    globals.userLogsChannelID
  );

  // Send log message
  userLogsChannel.send({
    embeds: [
      {
        title: "⚠️ User Updated",
        description: `<@${mongoStudent._id}> has ${interaction.options.data[0].value}d privacy mode.`,
        footer: {
          iconURL: discordClient.user.displayAvatarURL(),
          text: "VLC OneKey | Verified once, verified forever.",
        },
        color: 16705372,
      },
    ],
  });
};
