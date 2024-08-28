const main = async () => {
  const startServer = require('./server');
  const Database = require('./database');

  const database = new Database(process.env.MONGO_URI);
  await database.connect(() => {
    console.log('Connected to MongoDB.');
  });

  module.exports.database = database;

  const DiscordBot = require('./discord');
  const discordBot = new DiscordBot(process.env.TOKEN);

  module.exports.discordBot = discordBot;

  await discordBot.initialize(() => {
    console.log('Connected to Discord.');
  });

  startServer({
    host: process.env.APP_DOMAIN,
    port: process.env.APP_PORT,
    onSuccess: () => {
      console.log(`OneKey online: http://${process.env.APP_DOMAIN}`);
    },
  });
};

main();
