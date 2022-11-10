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
} = require('../../../index');

module.exports = async function (interaction) {
  if (
    interaction.options.get('verifiedrole').role.position >=
    interaction.guild.me.roles.highest.position
  )
    return globals.respond(
      interaction,
      false,
      ':x: Invalid Role',
      "VLC OneKey's highest role is below the verified role you have selected. Please move the `VLC OneKey` role to the top of the roles list in server settings."
    );

  let mongoGuild = await guildsCollection.findOne({
    _id: interaction.guild.id,
  });

  if (!mongoGuild) {
    guildsCollection.insertOne({
      _id: interaction.guild.id,
      name: interaction.guild.name,
      verifiedRole: interaction.options.get('verifiedrole').role.id,
      clubName: interaction.options.getString('clubname'),
      enrollmentLink: interaction.options.getString('enrollmentlink'),
    });
  } else {
    guildsCollection.updateOne(
      { _id: interaction.guild.id },
      {
        $set: {
          name: interaction.guild.name,
          verifiedRole: interaction.options.get('verifiedrole').role.id,
          clubName: interaction.options.getString('clubname'),
          enrollmentLink: interaction.options.getString('enrollmentlink'),
        },
      }
    );
  }
  globals.respond(interaction, true, '', '✅ Successfully initialized server.');
  globals.guild(interaction.guild, 'VLC OneKey initialized.');
};
