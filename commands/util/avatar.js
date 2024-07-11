const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mostra o avatar de um usuário')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('[DISCORD] O usuário cujo avatar você quer ver')
            .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;

        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Avatar de ${user.username}`)
            .setImage(avatarURL)
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        const button = new ButtonBuilder()
            .setLabel('Abrir avatar no navegador')
            .setStyle(ButtonStyle.Link)
            .setURL(avatarURL);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.reply({ 
            embeds: [embed], 
            components: [row], 
            ephemeral: false 
        });
    },
};