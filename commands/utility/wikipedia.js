const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Fetches a summary and image from Wikipedia')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The Wikipedia page to search for')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        try {
            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.title && data.extract) {
                const embed = new EmbedBuilder()
                    .setTitle(data.title)
                    .setDescription(data.extract.substring(0, 500) + (data.extract.length > 500 ? '...' : ''))
                    .setColor('#FFFFFF')
                    .setURL(data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`);

                if (data.thumbnail?.source) {
                    embed.setThumbnail(data.thumbnail.source);
                }

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('No results found for that query.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching from Wikipedia.');
        }
    },
};