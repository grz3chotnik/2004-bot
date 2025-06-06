const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server'),
    async execute(interaction) {
        const guild = interaction.guild;

        const iconUrl = guild.iconURL({ dynamic: true, size: 512 });

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Info`)
            .setDescription(
                `**Name:** ${guild.name}\n` +
                `**ID:** ${guild.id}\n` +
                `**Member Count:** ${guild.memberCount}\n` +
                `**Created On:** ${new Date(guild.createdAt).toLocaleDateString()}`
            )
            .setThumbnail(iconUrl || null)
            .setColor('#012FA6')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};