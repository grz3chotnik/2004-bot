const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('/Users/grz3chotnik/Desktop/stuffs/meower/config.json');

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log('Clearing all guild commands...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: [] }
        );
        console.log('Successfully cleared all guild commands.');
    } catch (error) {
        console.error('Error clearing commands:', error);
    }
})();