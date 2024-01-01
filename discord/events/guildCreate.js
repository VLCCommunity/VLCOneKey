const { discordBot } = require('../../index');

module.exports = async function (_client, guild) {
  discordBot.guild(guild, 'VLC OneKey has been added.');
};
