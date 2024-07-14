const { doc, setDoc } = require('firebase/firestore');
const { db } = require('../firebase');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        try {
            const owner = await guild.fetchOwner();
            const guildData = {
                id: guild.id,
                ownerID: owner.id,
                ownerTag: owner.user.tag
            };

            await setDoc(doc(db, 'Guilds', guild.id), guildData);
            console.log(`Guilda registrada no banco de dados: ${guild.name} (ID: ${guild.id}`)
        } catch (error) {
            console.error('Erro ao registrar guild no Firestore:', error);
        }
    }
}