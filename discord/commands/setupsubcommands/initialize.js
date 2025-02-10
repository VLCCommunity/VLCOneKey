const { database, discordBot } = require('../../../index');

module.exports = async function (interaction) {
  const me = await interaction.guild.members.fetchMe();
  if (
    interaction.options.get('verifiedrole').role.position >=
    me.roles.highest.position
  )
    return discordBot.respond(
      interaction,
      false,
      ':x: Invalid Role',
      "VLC OneKey's highest role is below the verified role you have selected. Please move the `VLC OneKey` role to the top of the roles list in server settings.",
    );

  let mongoGuild = await database.guildsCollection.findOne({
    _id: interaction.guild.id,
  });

  if (!mongoGuild) {
    database.guildsCollection.insertOne({
      _id: interaction.guild.id,
      name: interaction.guild.name,
      verifiedRole: interaction.options.get('verifiedrole').role.id,
      clubName: interaction.options.getString('clubname'),
      enrollmentLink: interaction.options.getString('enrollmentlink'),
    });
  } else {
    database.guildsCollection.updateOne(
      { _id: interaction.guild.id },
      {
        $set: {
          name: interaction.guild.name,
          verifiedRole: interaction.options.get('verifiedrole').role.id,
          clubName: interaction.options.getString('clubname'),
          enrollmentLink: interaction.options.getString('enrollmentlink'),
        },
      },
    );
  }
  discordBot.respond(
    interaction,
    true,
    '',
    '✅ Successfully initialized server.',
  );
  discordBot.guild(interaction.guild, 'VLC OneKey initialized.');
};
