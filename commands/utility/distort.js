const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('distort')
        .setDescription('Distorts an image with JPEG artifacts.')
        .addAttachmentOption((option) =>
            option
                .setName('image')
                .setDescription('The image to distort (optional).')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply(); // Defer reply for image processing

        try {
            let imageUrl;

            // Check for attachment
            const imageAttachment = interaction.options.getAttachment('image');
            if (imageAttachment) {
                if (!imageAttachment.contentType.startsWith('image/')) {
                    await interaction.editReply('Please provide a valid image file.');
                    return;
                }
                imageUrl = imageAttachment.url;
            } else {
                // Check for user mention, default to command executor if none
                const targetUser = interaction.options.getUser('user') || interaction.user;
                imageUrl = targetUser.displayAvatarURL({ dynamic: true, size: 512 }); // Higher resolution for better effect
            }

            // Load the image
            const image = await loadImage(imageUrl);

            // Create canvas with image dimensions
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');

            // Draw the image
            ctx.drawImage(image, 0, 0);

            // Export as low-quality JPEG to introduce artifacts
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.04 }); // Low quality for heavy artifacts

            // Create attachment
            const attachment = new AttachmentBuilder(buffer, { name: 'distorted.jpg' });

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle('Distorted Image')
                .setImage('attachment://distorted.jpg')
                .setColor('#012FA6')
                .setTimestamp();

            // Reply with embed and attachment
            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while processing the image.');
        }
    },
};