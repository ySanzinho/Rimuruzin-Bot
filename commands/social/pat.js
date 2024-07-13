const { SlashCommandBuilder, EmbedBuilder, userMention  } = require('discord.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();
const tenorApiKey = process.env.TENOR_API_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pat')
		.setDescription('[SOCIAL] Enviei um carinho para seu amado.')
        .addUserOption(option => option.setName('usuário')
        .setDescription('Usuário que deseja dar um carinho.')
        .setRequired(true)
  ),
    async execute(interaction) {
      try {
        //Pega o membro mencionado no comando
        const target = interaction.options.getUser('usuário');
        const autor = interaction.user;

        //Busca o gif na API
        const response = await fetch(`https://tenor.googleapis.com/v2/search?q=anime-pat&key=${tenorApiKey}&random=true`);
        const retorno = await response.json();
  
        // Verificar se a lista de resultados está presente e não está vazia
        if (!retorno.results || retorno.results.length === 0) {
          await interaction.reply({ content: `Não foi possível encontrar um GIF para a palavra-chave "${palavra}".`, ephemeral: true });
          return;
        }
  
        // Acessar o primeiro resultado na lista de resultados
        const gifUrl = retorno.results[0].media_formats.gif.url;

        const patEmbed = new EmbedBuilder()
          .setTitle(`🤗 ${autorMention} beijou ${targetMention}`)
          .setImage(gifUrl)
          .setColor('#ff878d')
          .setFooter({
            text: `Carinho enviado por ${author.tag}>`,
            iconURL: autor.displayAvatarURL({ dynamic: true })
          });
  
        await interaction.reply({ embeds: [patEmbed] })
      } catch (error) {
        console.error('Erro ao buscar GIF:', error);
        await interaction.reply({ content: 'Houve um erro ao procurar o GIF.', ephemeral: true });
      }
    },
  };