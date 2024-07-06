const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Informa informações sobre o usuário.'),
        async execute(interaction) {
            await interaction.reply(`Esse comando foi executado pelo ${interaction.user.username}, que entrou em ${interaction.member.joinedAt}.`);
        }
}