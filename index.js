/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

// Discord imports

const { Client, Intents, Permissions } = require('discord.js');

// Express imports

const express = require('express');
const bodyParser = require('body-parser');

// Database Credentials

const { MongoClient } = require('mongodb');

const mongoDB = new MongoClient(
  process.env['MONGO_URI'] + 'myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Connect to Mongo

mongoDB.connect((err) => {
  if (!err) {
    console.log('✅ Connected to MongoDB.');
  } else {
    console.log(`❌ Failed to connect to MongoDB. ${err}`);
  }
});

// Mongo Collections

const studentsDB = mongoDB.db('StudentsDB');
const studentsCollection = studentsDB.collection('Students');
const guildsCollection = studentsDB.collection('Guilds');
const statesCollection = studentsDB.collection('States');

const developerDB = mongoDB.db('DeveloperDB');
const keyCollection = developerDB.collection('Api_Keys');

// Discord

const discordClient = new Client({
  intents: 32727,
});

discordClient.login(process.env['TOKEN']);

// EXPORTS

module.exports = {
  discordClient,
  studentsCollection,
  guildsCollection,
  statesCollection,
  keyCollection,
};

const globals = require('./bot/globals');
module.exports.globals = globals;

// Discord Event Listeners
discordClient.once('ready', async () => {
  console.log('✅ Connected to Discord.');

  discordClient.user.setActivity({
    name: `${await studentsCollection.countDocuments()} verified VLCers!`,
    type: 3,
  });
});

discordClient.on('debug', (e) => {
  if (e.substr(6, 3) == '429') {
    // discord ban/ratelimit
    require('child_process').exec('kill 1');
  }
});

discordClient.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    try {
      let executeCommand = require(`./bot/commands/${interaction.commandName}`);
      await executeCommand(interaction);
    } catch (error) {
      console.log(
        `❌ Unable to execute ${interaction.commandName} command. \n` + error
      );
    }
  } else if (interaction.isButton()) {
    try {
      let executeButton = require(`./bot/buttons/${interaction.customId}`);
      await executeButton(interaction);
    } catch (error) {
      console.log(
        `❌ Unable to execute ${interaction.customId} button. \n` + error
      );
    }
  }
});

const guildMemberAdd = require('./bot/events/guildMemberAdd');
const guildMemberUpdate = require('./bot/events/guildMemberUpdate');
const guildCreate = require('./bot/events/guildCreate');
const guildDelete = require('./bot/events/guildDelete');

discordClient.on('guildMemberAdd', (member) => {
  guildMemberAdd(member);
});
discordClient.on('guildMemberUpdate', (oldMember, newMember) => {
  guildMemberUpdate(oldMember, newMember);
});
discordClient.on('guildCreate', (guild) => {
  guildCreate(guild);
});
discordClient.on('guildDelete', (guild) => {
  guildDelete(guild);
});

console.log('✅ Activated event listeners for Discord.');

// Express

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(require('./router'));

app.listen(
  {
    host: process.env.APP_DOMAIN,
    port: process.env.APP_PORT,
  },
  () => {
    console.log(`✅ OneKey online: https://${process.env.APP_DOMAIN}`);
  }
);
