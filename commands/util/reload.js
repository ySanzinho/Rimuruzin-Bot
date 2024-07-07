const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('[DONO] Recarrega um comando.')
		.addStringOption(option => 
			option.setName('command')
			.setDescription('The command to reload')
			.setRequired(true)),
	async execute(interaction) {
		const allowedUserId = '270331100532965377';
		if (interaction.user.id !== allowedUserId) {
			return interaction.reply({ content: 'Você não tem permissão para executar esse comando!', ephemeral: true });
		}

		const commandName = interaction.options.getString('command', true).toLowerCase();

		// Função para procurar o comando em todas as subpastas
		const findCommandPath = (dir, commandName) => {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const filePath = path.join(dir, file);
				const stat = fs.lstatSync(filePath);
				if (stat.isDirectory()) {
					const result = findCommandPath(filePath, commandName);
					if (result) return result;
				} else if (file === `${commandName}.js`) {
					return filePath;
				}
			}
			return null;
		};

		const commandsPath = path.join(__dirname, '..', '..', 'commands');
		const commandPath = findCommandPath(commandsPath, commandName);

		if (!commandPath) {
			return interaction.reply(`Não tem comando com esse nome \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(commandPath)];

		try {
			const newCommand = require(commandPath);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(`Comando \`${newCommand.data.name}\` foi recarregado!`);
		} catch (error) {
			console.log(error);
			await interaction.reply(`Teve um erro tentando recarregar o comando \`${commandName}\`:\n\`${error.message}\``);
		}
	},
};