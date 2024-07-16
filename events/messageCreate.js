const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');
const { db } = require('../firebase');

const cooldowns = {};

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return; // Ignorar mensagens de bots

    try {
      const userId = message.author.id;
      const userDoc = doc(db, 'Users', userId);
      const docSnap = await getDoc(userDoc);

      let userData;
      if (!docSnap.exists()) {
        userData = {
          id: userId,
          xp: 0,
          level: 1
        };
        await setDoc(userDoc, userData);
        console.log(`Novo usuário criado: ${userId}`);
      } else {
        userData = docSnap.data();
      }

      const now = Date.now();
      const cooldown = 4000; // 4 segundos

      if (cooldowns[userId] && now - cooldowns[userId] < cooldown) {
        return; // Dentro do cooldown, ignore a mensagem
      }

        // Atualizar timestamp em memória
        cooldowns[userId] = now;

      // Adicionar XP e verificar se o usuário sobe de nível
      const xpGained = Math.floor(Math.random() * 11) + 5; // XP ganho aleatório entre 5 e 15
      userData.xp += xpGained;

      const nextLevelXP = userData.level * 100; // XP necessário para o próximo nível
      if (userData.xp >= nextLevelXP) {
        userData.level += 1;
        userData.xp = userData.xp - nextLevelXP;
        message.channel.send(`Parabéns, <@${userId}>! Você subiu para o nível ${userData.level}.`);
      }

      await updateDoc(userDoc, {
        xp: userData.xp,
        level: userData.level
      });
    } catch (error) {
      console.error('Erro ao processar mensagem para XP:', error);
    }
  },
};
