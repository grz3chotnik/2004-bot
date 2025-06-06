const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),

    async execute(interaction) {
        // Create a new embed for our help message
        const helpEmbed = new EmbedBuilder()
            .setTitle('Bot Commands')
            .setColor('#012FA6')
            .setDescription('all the bot commands');

        // Get the commands directory path
        const foldersPath = path.join(__dirname, '..');
        const commandFolders = fs.readdirSync(foldersPath);

        // Loop through all command folders and files
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            // Create a field for each category (folder)
            let commandsList = '';

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    commandsList += `**/${command.data.name}** - ${command.data.description}\n`;
                }
            }

            if (commandsList.length > 0) {
                helpEmbed.addFields({
                    name: folder.charAt(0).toUpperCase() + folder.slice(1),
                    value: commandsList
                });
            }
        }

        // Send the embed
        await interaction.reply({ embeds: [helpEmbed], ephemeral: false });
    },
};