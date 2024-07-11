const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('[DIVERSÃO] Envia um meme aleatório do Reddit'),
    async execute(interaction) {
        const url = 'https://www.reddit.com/r/memes/random/.json';

        try {
            const response = await fetch(url);
            const json = await response.json();

            const post = json[0].data.children[0].data;
            const memeUrl = post.url;
            const memeTitle = post.title;
            const memeAuthor = post.author;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(memeTitle)
                .setURL(`https://reddit.com${post.permalink}`)
                .setImage(memeUrl)
                .setFooter({ text: `Postado por u/${memeAuthor}` });

            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não foi possível encontrar um meme no momento. Tente novamente mais tarde.', ephemeral: true });
        }
    },
};