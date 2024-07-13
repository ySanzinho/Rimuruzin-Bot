const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();
const tenorApiKey = process.env.TENOR_API_KEY;

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

    try {
      const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${palavra}&key=${tenorApiKey}&random=true`);
      const retorno = await response.json();

      // Verificar se a lista de resultados está presente e não está vazia
      if (!retorno.results || retorno.results.length === 0) {
        await interaction.reply({ content: `Não foi possível encontrar um GIF para a palavra-chave "${palavra}".`, ephemeral: true });
        return;
      }

      // Acessar o primeiro resultado na lista de resultados
      const gifUrl = retorno.results[0].media_formats.gif.url;

      await interaction.reply(gifUrl)
    } catch (error) {
      console.error('Erro ao buscar GIF:', error);
      await interaction.reply({ content: 'Houve um erro ao procurar o GIF.', ephemeral: true });
    }
  },
};
