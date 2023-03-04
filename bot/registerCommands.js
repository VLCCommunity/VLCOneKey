const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 32727 });

const commands = [
  {
    name: 'api',
    description: 'Modify Developer API keys',
    options: [
      {
        type: 1,
        name: 'create',
        description: 'Create an API key',
        options: [
          {
            type: 6,
            name: 'student',
            description: 'Student must be verified with VLC OneKey.',
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'delete',
        description: "Delete a student's API key",
        options: [
          {
            type: 6,
            name: 'student',
            description: 'Student must previously have an API key.',
            required: true,
          },
        ],
      },
    ],
  },
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
            name: 'Enabled',
            value: 'enabled',
          },
          {
            name: 'Disabled',
            value: 'disabled',
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
