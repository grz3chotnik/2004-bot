const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        const avatarUrl = interaction.user.displayAvatarURL({ dynamic: true, size: 128 });

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username} Info`)
            .setDescription(`${interaction.user.username} joined on ${new Date(interaction.member.joinedAt).toLocaleDateString()}.`)
            .setThumbnail(avatarUrl)
            .setColor('#012FA6')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};