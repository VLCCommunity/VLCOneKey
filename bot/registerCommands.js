const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 32727 });

const commands = [
  {
    name: 'privacy',
    description: 'Toggle privacy mode.',
    options: [
      {
        type: 3,
        name: 'setting',
        description: 'Whether to enable or disable privacy mode.',
        choices: [
          {
            name: 'Enable',
            value: 'enable',
          },
          {
            name: 'Disable',
            value: 'disable',
          },
        ],
        required: true,
      },
    ],
  },
];

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}.`);

  for (let command of commands) {
    const registeredCommand = await client.application.commands.create(command); // register the command
    console.log(`✅ Created /${registeredCommand.name}`);
  }

  client.destroy(); // end script
});

client.login(process.env['TOKEN']);
