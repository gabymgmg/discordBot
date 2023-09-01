/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder } = require('discord.js');
const { isYoutubeUrl, getVideoId } = require('../lib/helpers');
const { youtubeSearchByText, convertToEmbeds, youtubeSearchById } = require('../services/discordPlayer');
const { useMainPlayer, useQueue } = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from Youtube')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name/link of the song')
                .setRequired(true)),
    execute: async (interaction) => {
        // Making sure the user is inside a voice channel
        const voiceChannel = interaction.member.voice.channel;
        const user = interaction.user;

        const player = useMainPlayer();
        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }
        // Getting the input and checking if it is a YT link
        const input = interaction.options.getString('song');
        await interaction.deferReply('Searching song');
        const video = !isYoutubeUrl(input) ? await youtubeSearchByText(input) : await youtubeSearchById(getVideoId(input));
        const [embed] = convertToEmbeds([video], user);

        // Getting the queue
        let queue = useQueue(interaction.guild.id);

        if (!queue) {
            queue = player.nodes.create(interaction.guild, { volume: 6 });

        }

        try {
            let queueConnection = queue.connection;
            if (!queueConnection) {
                queueConnection = await queue.connect(voiceChannel);
            }

            // Play the song
            if (!queue.isPlaying()) {
                queue.play(video.url);
            }
            else {
                queue.addTrack(video);
            }
        }
        catch (error) {
            console.error(error);
        }

        // Replying
        await interaction.editReply({ embeds:[embed.data] });

    },
};

