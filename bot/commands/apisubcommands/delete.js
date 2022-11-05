/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const {
  studentsCollection,
  keyCollection,
  globals,
} = require("../../../index");

module.exports = async function (interaction) {
  const student = await studentsCollection.findOne({
    _id: interaction.options.data[0].options[0].user.id,
  });

  const request = await keyCollection.deleteOne({ student });

  if (!request.deletedCount && request.acknowledged) {
    await globals.respond(
      interaction,
      false,
      "",
      `❌ ${interaction.options.data[0].options[0].user.tag} does not have an API key!`
    );
  } else if (!request.acknowledged) {
    await globals.respond(
      interaction,
      false,
      "",
      "❌ Failed to delete API key."
    );
  } else {
    await globals.respond(
      interaction,
      true,
      "",
      "✅ Successfully deleted API Key."
    );
  }
};
