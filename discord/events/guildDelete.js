const { discordBot } = require('../../index');

module.exports = async function (guild) {
  discordBot.guild(guild, 'VLC OneKey has been removed.');
};
