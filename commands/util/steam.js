const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const steamApiKey = process.env.STEAM_API_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('steam')
		.setDescription('[UTIL] Retorna o valor do jogo na Steam')
		.addStringOption(option => 
            option.setName('jogo')
                  .setDescription('Nome do jogo')
                  .setRequired(true)),
	async execute(interaction) {
		const gameName = interaction.options.getString('jogo');

		try {
			// Fazer uma busca pelo jogo
			const searchUrl = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;
			const response = await axios.get(searchUrl);
			const gameList = response.data.applist.apps;

			// Filtrar apenas aplicativos que são jogos (excluir DLCs e outros conteúdos não relacionados a jogos)
			const games = gameList.filter(app => {
				const lowerCaseName = app.name.toLowerCase();
				return lowerCaseName.includes(gameName.toLowerCase()) && !lowerCaseName.includes('dlc') && !lowerCaseName.includes('soundtrack') && app.appid !== 228380;
			});

			if (games.length === 0) {
				await interaction.reply(`Jogo "${gameName}" não encontrado na Steam.`);
				return;
			}

			// Selecionar o primeiro jogo encontrado
			const game = games[0];
			const appid = game.appid;

			// Obter os detalhes do jogo
			const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=br&l=portuguese`;
			const detailsResponse = await axios.get(detailsUrl);

			// Verificar se a resposta foi bem-sucedida e se os dados do jogo estão disponíveis
			if (detailsResponse.status === 200 && detailsResponse.data && detailsResponse.data[appid] && detailsResponse.data[appid].success) {
				const gameData = detailsResponse.data[appid].data;
				const gameLink = `https://store.steampowered.com/app/${appid}`;
				const gameCover = gameData.header_image;

				if (gameData.price_overview) {
					const priceOverview = gameData.price_overview;
					const originalPrice = priceOverview.initial_formatted;
					const discountPrice = priceOverview.final_formatted;
					const discountPercent = priceOverview.discount_percent;

					let priceMessage;
					let promoMessage = "N/A";
					let discountMessage = "N/A";

					if (discountPercent > 0) {
						priceMessage = `${originalPrice}`;
						promoMessage = `${discountPrice}`;
						discountMessage = `${discountPercent}% de desconto`;
					} else {
						priceMessage = `${discountPrice}`;
					}

					await interaction.reply({
						content: `Informações do jogo "${gameName}": [Link para o jogo](${gameLink})`,
						embeds: [{
							title: gameName,
							url: gameLink,
							image: { url: gameCover },
							fields: [
								{ name: 'PREÇO', value: priceMessage, inline: true },
								{ name: 'PROMOÇÃO', value: promoMessage, inline: true },
								{ name: 'Desconto', value: discountMessage, inline: true }
							]
						}]
					});
				} else {
					await interaction.reply(`O jogo "${gameName}" está atualmente indisponível para compra. [Link para o jogo](${gameLink})`);
				}
			} else {
				await interaction.reply(`Não foi possível obter informações para o jogo "${gameName}".`);
			}
		} catch (error) {
			await interaction.reply(`Ocorreu um erro ao buscar informações para o jogo "${gameName}": ${error.message}`);
		}
	},
};