const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('[BOT] Mostra informações sobre o bot'),
    async execute(interaction) {
        const client = interaction.client;

        // Obtendo informações sobre o bot
        const botName = client.user.username;
        const botTag = client.user.tag;
        const botAvatar = client.user.displayAvatarURL({ dynamic: true });
        const botCreatedAt = client.user.createdAt;
        const botUptime = process.uptime();
        const totalGuilds = client.guilds.cache.size;
        const totalUsers = client.users.cache.size;
        const nodeVersion = process.version;
        const discordJsVersion = require('discord.js').version;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Informações do Bot')
            .setThumbnail(botAvatar)
            .addFields(
                { name: 'Nome', value: `\`${botName}\``, inline: true },
                { name: 'Tag', value: `\`${botTag}\``, inline: true },
                { name: 'ID', value: `\`${client.user.id}\``, inline: true },
                { name: 'Criado em', value: `\`${botCreatedAt.toLocaleDateString('pt-BR')} às ${botCreatedAt.toLocaleTimeString('pt-BR')}\``, inline: false },
                { name: 'Tempo de Atividade', value: `\`${Math.floor(botUptime / 3600)}h ${Math.floor(botUptime % 3600 / 60)}m ${Math.floor(botUptime % 60)}s\``, inline: true },
                { name: 'Total de Servidores', value: `\`${totalGuilds}\``, inline: true },
                { name: 'Total de Usuários', value: `\`${totalUsers}\``, inline: true },
                { name: 'Versão do Node.js', value: `\`${nodeVersion}\``, inline: true },
                { name: 'Versão do Discord.js', value: `\`${discordJsVersion}\``, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};