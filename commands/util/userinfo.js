const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('[Discord] Mostra informações sobre o usuário no servidor.')
        .addUserOption(option => option.setName('usuario').setDescription('O usuário para obter informações sobre')),

    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id);

        const userInfoEmbed = new EmbedBuilder()
            .setTitle('Informação do usuário')
            .addFields([
                { name: '🆔 Discord ID', value: target.id, inline: true },
                { name: '💠 Discord Tag', value: target.tag, inline: true },
                { name: '📅 Criação da Conta', value: target.createdAt.toLocaleString(), inline: true },
            ])
            .setThumbnail(target.displayAvatarURL({ dynamic: true }));

        const memberInfoEmbed = new EmbedBuilder()
            .setTitle('Informação do membro')
            .setDescription(member.displayName)
            .addFields([
                { name: '📅 Tempo de membro', value: member.joinedAt.toLocaleString(), inline: true },
                { name: '💠 Boosting', value: member.premiumSince ? member.premiumSince.toLocaleString() : 'Nunca deu 😒', inline: true },
                { name: '🔰 Maior cargo', value: member.roles.highest.toString(), inline: true },
            ])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }));

        await interaction.reply({ embeds: [userInfoEmbed, memberInfoEmbed] });
    },
};
