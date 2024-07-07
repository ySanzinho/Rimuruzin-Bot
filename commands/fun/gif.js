const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();
const giphyApiKey = process.env.GIPHY_API_KEY;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('[DIVERSÃO] Retorna um GIF baseado em uma palavra-chave')
    .addStringOption(option =>
      option.setName('palavra')
        .setDescription('A palavra-chave para procurar o GIF')
        .setRequired(true)
    ),
  async execute(interaction) {
    const palavra = interaction.options.getString('palavra');

    // USO PARA DEBUG
    // console.log(`Buscando GIF com a palavra-chave: ${palavra}`);

    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&tag=${palavra}&rating=g`);
      const result = await response.json();

      // USO PARA DEBUG
      //console.log('Resposta da API Giphy:', result);

      const gifUrl = result.data.url;

      await interaction.reply(gifUrl)
    } catch (error) {
      console.error('Erro ao buscar GIF:', error);
      await interaction.reply({ content: 'Houve um erro ao procurar o GIF.', ephemeral: true });
    }
  },
};
