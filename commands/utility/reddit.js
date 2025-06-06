const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Get a random post from a subreddit')
        .addStringOption(option =>
            option.setName('subreddit')
                .setDescription('Name of the subreddit (without r/)')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const subreddit = interaction.options.getString('subreddit').toLowerCase();

        try {
            // First, check if the subreddit exists and is accessible
            const subredditCheck = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`);
            const subredditData = await subredditCheck.json();

            if (subredditData.error === 404 || subredditData.data?.error === 404) {
                return interaction.editReply(`Subreddit 'r/${subreddit}' doesn't exist!`);
            }

            if (subredditData.error === 403 || subredditData.data?.error === 403) {
                return interaction.editReply(`Subreddit 'r/${subreddit}' is private or banned!`);
            }

            // Fetch posts from the subreddit
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50`);
            const data = await response.json();

            if (!data.data?.children?.length) {
                return interaction.editReply(`No posts found in r/${subreddit}`);
            }

            // Filter for posts with images
            const imagePosts = data.data.children.filter(post => {
                const url = post.data.url;
                return !post.data.is_self &&
                    (url.endsWith('.jpg') ||
                        url.endsWith('.png') ||
                        url.endsWith('.gif') ||
                        url.endsWith('.jpeg'));
            });

            if (imagePosts.length === 0) {
                return interaction.editReply(`No image posts found in the last 50 posts of r/${subreddit}`);
            }

            // Select a random image post
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)].data;

            const embed = new EmbedBuilder()
                .setTitle(randomPost.title.length > 256 ? randomPost.title.substring(0, 253) + '...' : randomPost.title)
                .setURL(`https://reddit.com${randomPost.permalink}`)
                .setImage(randomPost.url)
                .setColor('#FF4500')
                .setFooter({
                    text: `👍 ${randomPost.ups.toLocaleString()} | 💬 ${randomPost.num_comments.toLocaleString()}`
                })
                .setTimestamp(randomPost.created_utc * 1000);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply('There was an error fetching the post. Please try again later.');
        }
    },
};