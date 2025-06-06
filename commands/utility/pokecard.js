const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokecard')
        .setDescription('Creates a Pokémon-style card with custom stats')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of your character')
                .setRequired(true))
        .addAttachmentOption(option =>
            option
                .setName('image')
                .setDescription('Character image')
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName('hp')
                .setDescription('HP stat (1-100)')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Character type')
                .addChoices(
                    { name: 'Fire', value: '#FF4444' },
                    { name: 'Water', value: '#44AAFF' },
                    { name: 'Grass', value: '#44FF44' },
                    { name: 'Electric', value: '#FFFF44' },
                    { name: 'Psychic', value: '#FF44FF' },
                    { name: 'Dark', value: '#444444' }
                )
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Get command options
            const name = interaction.options.getString('name');
            const hp = Math.min(100, Math.max(1, interaction.options.getNumber('hp')));
            const type = interaction.options.getString('type');
            const attachment = interaction.options.getAttachment('image');

            // Validate image
            if (!attachment.contentType.startsWith('image/')) {
                return interaction.editReply('Please provide a valid image file.');
            }

            // Set up canvas
            const canvas = createCanvas(400, 600);
            const ctx = canvas.getContext('2d');

            // Card background
            ctx.fillStyle = type;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Inner card background (slightly lighter)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

            // Load and draw character image
            const image = await loadImage(attachment.url);

            // Create image frame
            ctx.fillStyle = type;
            ctx.fillRect(40, 60, 320, 320);

            // Draw image with proper scaling
            const scale = Math.min(300 / image.width, 300 / image.height);
            const x = 40 + (320 - image.width * scale) / 2;
            const y = 60 + (320 - image.height * scale) / 2;
            ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

            // Add name banner
            ctx.fillStyle = type;
            ctx.fillRect(40, 400, 320, 50);

            // Add name text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(name, canvas.width / 2, 435);

            // Add HP
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`HP ${hp}`, canvas.width - 50, 50);


            // Add stats box
            ctx.fillStyle = '#F0F0F0';
            ctx.fillRect(40, 470, 320, 100);

            // Add random stats
            const stats = [
                `Attack: ${Math.floor(Math.random() * 100)}`,
                `Defense: ${Math.floor(Math.random() * 100)}`,
                `Speed: ${Math.floor(Math.random() * 100)}`
            ];

            ctx.fillStyle = '#000000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            stats.forEach((stat, index) => {
                ctx.fillText(stat, 60, 500 + (index * 30));
            });

            // Create attachment
            const buffer = canvas.toBuffer('image/png');
            const cardAttachment = new AttachmentBuilder(buffer, { name: 'pokemon-card.png' });

            await interaction.editReply({ files: [cardAttachment] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while creating the card.');
        }
    },
};