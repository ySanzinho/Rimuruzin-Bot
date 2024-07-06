const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

//Module "DOTENV" for hidden the information of bot
const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[ATENÇÃO!] O comando ${filePath} está faltando propriedade "data" ou "execute" obrigatórias.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Pronto! Logado como ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`Nenhum comando: ${interaction.commandName} foi achado.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Teve algum erro ao executar esse comando!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Teve algum erro ao executar esse comando!', ephemeral: true });
		}
	}
});

client.login(process.env.CLIENT_TOKEN);