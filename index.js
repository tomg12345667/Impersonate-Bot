import 'dotenv/config';
import fs from 'fs';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

function getData() {
  return JSON.parse(fs.readFileSync("./data.json"));
}

function saveData(data) {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
}

const command = {
  name: 'impersonate',
  description: 'Send a message as another user',
  options: [
    { type: 6, name: 'user', description: 'User to impersonate', required: true },
    { type: 3, name: 'message', description: 'Message to send', required: true }
  ]
};

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationCommands(clientId), { body: [command] });
    console.log('command registered');
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'impersonate') return;

  await interaction.deferReply({ ephemeral: true });

  const data = getData();

  if (data.blockedUsers.includes(interaction.user.id)) {
    return interaction.editReply('🚫 You are blocked from impersonating.');
  }

  if (interaction.member.roles.cache.some(r => data.blockedRoles.includes(r.id))) {
    return interaction.editReply('🚫 Your role is blocked.');
  }

  const targetUser = interaction.options.getUser('user');
  const messageText = interaction.options.getString('message');

  const member = await interaction.guild.members.fetch(targetUser.id);
  const displayName = member.displayName;
  const avatarURL = member.displayAvatarURL({ extension: 'png', size: 512 });

  const webhook = await interaction.channel.createWebhook({
    name: displayName,
    avatar: avatarURL
  });

  await webhook.send({ content: messageText });
  await webhook.delete();

  await interaction.editReply('Message sent');
});

client.login(token);
