const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandNames = new Set(); // Track command names to detect duplicates
const foldersPath = path.join(__dirname, 'commands');

try {
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                const commandName = command.data.name;
                if (commandNames.has(commandName)) {
                    console.error(`[ERROR] Duplicate command name "${commandName}" found in ${filePath}`);
                    continue; // Skip duplicate command
                }
                commandNames.add(commandName);
                commands.push(command.data.toJSON());
                console.log(`[INFO] Loaded command "${commandName}" from ${filePath}`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
} catch (error) {
    console.error(`[ERROR] Failed to read commands folder: ${error.message}`);
    process.exit(1);
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();