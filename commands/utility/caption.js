const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('caption')
        .setDescription('Adds a caption to an image or avatar.')
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('The caption text.')
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user whose avatar to caption (optional).')
                .setRequired(false)
        )
        .addAttachmentOption((option) =>
            option
                .setName('image')
                .setDescription('The image to caption (optional).')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const text = interaction.options.getString('text');
            let imageUrl;

            // Get image source
            const imageAttachment = interaction.options.getAttachment('image');
            if (imageAttachment) {
                if (!imageAttachment.contentType.startsWith('image/')) {
                    await interaction.editReply('Please provide a valid image file.');
                    return;
                }
                imageUrl = imageAttachment.url;
            } else {
                const targetUser = interaction.options.getUser('user') || interaction.user;
                imageUrl = targetUser.displayAvatarURL({ dynamic: true, size: 512 });
            }

            // Load image
            const image = await loadImage(imageUrl);
            const canvas = createCanvas(image.width, image.height + 50); // Extra height for text
            const ctx = canvas.getContext('2d');

            // Draw image
            ctx.drawImage(image, 0, 0);

            // Add text
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.font = 'bold 250px Impact';
            ctx.textAlign = 'center';
            ctx.strokeText(text, canvas.width / 2, canvas.height - 25);
            ctx.fillText(text, canvas.width / 2, canvas.height - 25);

            // Export and send
            const buffer = canvas.toBuffer('image/png');
            const attachment = new AttachmentBuilder(buffer, { name: 'captioned.png' });
            const embed = new EmbedBuilder()
                .setTitle('Captioned Image')
                .setDescription(`Captioned for ${interaction.user.username}.`)
                .setImage('attachment://captioned.png')
                .setColor('#012FA6')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while processing the image.');
        }
    },
};