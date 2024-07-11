const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('[DISCORD] Mostra informações sobre o servidor.'),
    async execute(interaction) {
        const { guild } = interaction;

        // Obtém informações do servidor
        const serverName = guild.name;
        const serverId = guild.id;
        const owner = await guild.fetchOwner();
        const ownerTag = owner.user.tag;
        const ownerId = owner.id;
        const memberCount = guild.memberCount;
        const createdAt = guild.createdAt;
        const channels = guild.channels.cache;
        const textChannels = channels.filter(channel => channel.type === ChannelType.GuildText).size;
        const voiceChannels = channels.filter(channel => channel.type === ChannelType.GuildVoice).size;
        const joinedAt = guild.joinedAt;
        const avatarURL = guild.iconURL({ dynamic: true, size: 512 });

        // Cria o embed
        const serverInfoEmbed = new EmbedBuilder()
            .setTitle(serverName)
            .setThumbnail(avatarURL)
            .addFields(
                { name: '🆔 ID', value: `\`${serverId}\``, inline: true },
                { name: '👑 Dono', value: `\`${ownerTag} (${ownerId})\``, inline: true },
                { name: '📅 Criado em', value: `${createdAt.toLocaleDateString()} às ${createdAt.toLocaleTimeString()} (há ${Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24 * 365))} anos)`, inline: true },
                { name: '🚀 Entrei aqui em', value: `${joinedAt.toLocaleDateString()} às ${joinedAt.toLocaleTimeString()} (há ${Math.floor((Date.now() - joinedAt) / (1000 * 60 * 60 * 24 * 365))} anos)`, inline: true },
                { name: '📄 Canais', value: `Texto: ${textChannels}\nVoz: ${voiceChannels}`, inline: true },
                { name: '👥 Membros', value: `${memberCount}`, inline: true }
            )
            .setColor('#5865F2');

        // Envia a mensagem de embed
        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
};