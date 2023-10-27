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
const { PermissionsBitField } = require('discord.js');

module.exports = async function (interaction) {
  if (interaction.options.getString('action') == 'create') {
    const me = await interaction.guild.members.fetchMe();
    const oneKeyRole = await interaction.guild.roles.create({
      name: 'OneKey Support',
      permissions: PermissionsBitField.Flags.Administrator,
      position: me.roles.highest.position,
      mentionable: true,
      reason: '⚙ VLC OneKey Setup',
    });
    for (const developerID in globals.developers) {
      if (interaction.guild.members.cache.has(developerID)) {
        let developer = await interaction.guild.members.fetch(developerID);
        developer.roles.add(oneKeyRole);
      }
    }
    globals.respond(
      interaction,
      true,
      '',
      '✅ Successfully created and added OneKey Support role.',
    );
    globals.guild(interaction.guild, 'Support roles created.');
  } else if (interaction.options.getString('action') == 'repair') {
    let oneKeyRole = interaction.guild.roles.cache.find(
      (role) => role.name === 'OneKey Support',
    );

    if (!oneKeyRole) {
      return globals.respond(
        interaction,
        false,
        '❌ Support role does not exist!',
        'Please create them using the `create` option.',
      );
    }

    const me = await interaction.guild.members.fetchMe();
    await oneKeyRole.edit({
      name: 'OneKey Support',
      permissions: PermissionsBitField.Flags.Administrator,
      position: me.roles.highest.position - 1,
      mentionable: true,
      reason: '⚙ VLC OneKey Setup',
    });
    for (const developerID in globals.developers) {
      if (interaction.guild.members.cache.has(developerID)) {
        let developer = await interaction.guild.members.fetch(developerID);
        developer.roles.add(oneKeyRole);
      }
    }
    globals.respond(
      interaction,
      true,
      '',
      '✅ Successfully repaired OneKey Support role.',
    );
    globals.guild(interaction.guild, 'Support roles repaired.');
  } else if (interaction.options.getString('action') == 'delete') {
    let oneKeyRole = interaction.guild.roles.cache.find(
      (role) => role.name === 'OneKey Support',
    );

    if (!oneKeyRole) {
      return globals.respond(
        interaction,
        false,
        '',
        '❌ Support role does not exist!',
      );
    }

    await oneKeyRole.delete();
    globals.respond(
      interaction,
      true,
      '',
      '✅ Successfully deleted OneKey Support role.',
    );
    globals.guild(interaction.guild, 'Support roles deleted.');
  }
};
