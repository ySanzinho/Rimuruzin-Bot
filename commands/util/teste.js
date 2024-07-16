const { SlashCommandBuilder } = require('discord.js');
const { doc, getDoc, setDoc } = require('firebase/firestore');
const { db } = require('../../firebase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teste')
    .setDescription('Teste registro banco de dados'),

  async execute(interaction) {
    const user = interaction.user;
    try {
      const userDoc = doc(db, 'Users', user.id);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const userId = docSnap.data().id;
        await interaction.reply(`O ID armazenado para o usuário <@${user.id}> é: ${userId}`);
      } else {
        const data = { 
          id: user.id,
          xp: 0,
          level: 1
        };
        await setDoc(userDoc, data);
        await interaction.reply(`Usuário <@${user.id}> cadastrado no banco de dados com ID: ${user.id}`);
      }
    } catch (error) {
      console.error('Erro ao consultar usuário no Firestore:', error);
      await interaction.reply('Houve um erro ao consultar o ID na database.');
    }
  }
};