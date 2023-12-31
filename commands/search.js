/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { youtubeSearchByText, convertToEmbeds } = require('../services/discordPlayer');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search a song in Youtube, returns first 5 options')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name of the song')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('qty')
                .setDescription('Qty (num) of results to retrieve')
                .setRequired(false)),

    execute: async (interaction) => {
        // Making sure the user is inside a voice channel
        const voiceChannel = interaction.member.voice.channel;
        const user = interaction.user;

        const player = useMainPlayer();
        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        // Getting the input and searching YT songs
        const input = interaction.options.getString('song');
        const qtyResults = interaction.options.getString('qty') || 3;
        // Getting the videos from YT
        const videos = await youtubeSearchByText(input, qtyResults);

        // Building the embed to show song options
        const embed = new EmbedBuilder();
        const fields = videos.map((video, index) => ({
            name: `Option - ${index + 1}`,
            value: video.title,
        }));
        embed.addFields(fields);
        embed.setTitle('Enter a number:');
        embed.setColor([255, 192, 203]);
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        // Filter the responses from other users and qty
        const collectorFilter = (response) => {
            return response.author.id === user.id && !isNaN(response.content) && response.content >= 1 && response.content <= videos.length;
        };

        // Create a message collector to collect the user's response
        const collector = interaction.channel.createMessageCollector({
            filter: collectorFilter,
            time: 17000,
            max: 1,
        });

        collector.on('collect', async (response) => {
            const selectedOption = parseInt(response.content);

            if (selectedOption >= 1 && selectedOption <= videos.length) {
                // Handle the user's choice - play the option
                const selectedVideo = videos[selectedOption - 1];

                // Getting the queue
                const queue = useQueue(interaction.guild.id) || player.nodes.create(interaction.guild, { volume: 6 });
                try {
                    const queueConnection = queue.connection || (await queue.connect(voiceChannel));
                    // Play the song
                    if (!queue.isPlaying()) {
                        queue.play(selectedVideo.url);
                    }
                    else {
                        queue.addTrack(selectedVideo);
                    }
                }
                catch (error) {
                    console.error(error);
                    interaction.followUp('Problems with song search');
                }
                // Construct the embed
                const [infoVideo] = convertToEmbeds([selectedVideo], user);
                // Play the selected video
                interaction.followUp({ embeds: [infoVideo.data], content: `You selected option ${selectedOption}:` });
            }
            else {
                // Handle invalid input (e.g., out of range)
                interaction.followUp('Invalid option selected.');
            }
            // Stop the collector after collecting one response
            collector.stop();
        });
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                // Handle the case where the collector times out
                interaction.followUp('You did not select a song within the time limit.');
            }
        });
    },
};

