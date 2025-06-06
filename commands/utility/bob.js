const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('bob')
        .setDescription('bob.'),
    async execute(interaction) {



        await interaction.reply('bob');
    },
};