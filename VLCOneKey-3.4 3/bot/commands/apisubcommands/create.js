/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const {
  discordClient,
  studentsCollection,
  keyCollection,
  globals,
} = require('../../../index');
const { randomUUID } = require('crypto');

module.exports = async function (interaction) {
  const student = await studentsCollection.findOne({
    _id: interaction.options.data[0].options[0].user.id,
  });

  if (!student) {
    // student not found
    return await globals.respond(
      interaction,
      false,
      '❌ Error',
      `${interaction.options.data[0].options[0].user.tag} is not verified with OneKey!`
    );
  }

  const existingApiKey = await keyCollection.findOne({ student: student });
  if (existingApiKey) {
    // user already has an API key
    return await globals.respond(
      interaction,
      false,
      '❌ Error',
      `${interaction.options.data[0].options[0].user.tag} already has an API key!`
    );
  }

  const apiKey = randomUUID();

  const request = await keyCollection.insertOne({
    key: apiKey,
    student: student,
    createdBy: interaction.user.id,
    timestamp: Date.now(),
  });

  if (request.acknowledged) {
    await globals.respond(
      interaction,
      true,
      '✅ Generated API Key.',
      `\`${apiKey}\``
    );

    try {
      await interaction.options.data[0].options[0].user.send({
        embeds: [
          {
            title: '✅ API Key Registered',
            description: `Your API key is: ||**${apiKey}**||.`,
            footer: {
              iconURL: discordClient.user.displayAvatarURL(),
              text: 'VLC OneKey | Verified once, verified forever.',
            },
            color: 2201331,
          },
        ],
      });

      await globals.respondAgain(
        interaction,
        true,
        '',
        `✅ API Key sent to ${interaction.options.data[0].options[0].user.tag}.`
      );
    } catch {
      // Cannot DM user
      await globals.respondAgain(
        interaction,
        false,
        '',
        `❌ Falied to send ${interaction.options.data[0].options[0].user.tag} API Key.`
      );
    }
  } else {
    await globals.respond(
      interaction,
      false,
      '',
      '❌ Failed to generate API key.'
    );
  }
};
