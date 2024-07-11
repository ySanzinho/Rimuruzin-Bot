const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ajuda')
		.setDescription('[BOT] Mostra a lista de comandos disponíveis.'),
	async execute(interaction) {
		// Diretório dos comandos
		const commandsPath = path.join(__dirname, '..', '..', 'commands');
		const categories = fs.readdirSync(commandsPath);

		// Criar um embed
		const embed = new EmbedBuilder()
			.setTitle('LISTA DE COMANDOS:')
			.setColor('#00FF00');

		// Iterar pelas categorias
		for (const category of categories) {
			const categoryPath = path.join(commandsPath, category);
			if (fs.lstatSync(categoryPath).isDirectory()) {
				const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
				const commands = commandFiles.map(file => {
					const command = require(path.join(categoryPath, file));
					return `/${command.data.name} - ${command.data.description}`;
				}).join('\n');

				// Adicionar um field para cada categoria
				embed.addFields({ name: category.toUpperCase(), value: commands || 'Nenhum comando disponível', inline: false });
			}
		}

		// Enviar o embed
		await interaction.reply({
			embeds: [embed],
			ephemeral: true // Isso faz com que a mensagem seja visível apenas para o usuário que digitou o comando
		});
	},
};
