const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json'); // Remove guildId since it's no longer needed

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log('Clearing all global commands...');
        await rest.put(
            Routes.applicationCommands(clientId), // Changed this line
            { body: [] }
        );
        console.log('Successfully cleared all global commands.');
    } catch (error) {
        console.error('Error clearing commands:', error);
    }
})();