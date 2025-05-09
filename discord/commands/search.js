const { discordBot, database } = require('../../index');

module.exports = async function (interaction) {
  const query = await database.studentsCollection
    .find({
      $text: {
        $search: interaction.options.data[0].value,
      },
    })
    .limit(
      interaction.options.data[0].value.includes('@virtuallearning.ca') ? 1 : 5,
    )
    .sort({
      score: {
        $meta: 'textScore',
      },
    });

  let fields = [];
  await query.forEach(async (student) => {
    const user = await discordBot.client.users.fetch(student._id);

    fields.push({
      name: student.name,
      value: `${user.username}#${user.discriminator} (<@${student._id}>)`,
      inline: false,
    });
  });

  const embed = {
    title: `Your search returned ${fields.length} result${
      fields.length != 1 ? 's' : ''
    }.`,
    fields: fields,
    footer: {
      iconURL: discordBot.client.user.displayAvatarURL(),
      text: 'VLC OneKey | Verified once, verified forever.',
    },
    color: 5763719,
  };

  if (!fields.length) {
    // no students found
    embed.description = 'Please refine your search term.';
    embed.color = 15548997;
  }

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};
