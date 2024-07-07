const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('[DONO] Recarrega um comando.')
		.addStringOption(option => 
			option.setName('command')
			.setDescription('The comand to reload')
			.setRequired(true)),
	async execute(interaction) {
		const allowedUserId = '270331100532965377';
		if (interaction.user.id !== allowedUserId) {
			return interaction.reply({ content: 'Você não tem permissão para executar esse comando!', ephemeral: true });
		}

		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`Não tem comando com esse nome \`${commandName}\`!`)
		}

		delete require.cache[require.resolve(`./${command.data.name}.js`)];

		try {
			const newCommand = require(`./${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(`Comando \`${newCommand.data.name}\` foi recarregado!`);
		}catch (error) {
			console.log(error);
			await interaction.reply(`Teve um erro tentando recarregar o comando \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
}