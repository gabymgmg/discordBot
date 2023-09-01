/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder } = require('discord.js');
const { isYoutubeUrl, getVideoId } = require('../lib/helpers');
const { youtubeSearchByText, convertToEmbeds, youtubeSearchById } = require('../services/discordPlayer');
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
        try {
            const videos = await youtubeSearchByText(input, qtyResults);
            console.log('videos', videos);

            // Building the menu
            const selectOptions = videos.map((video, index) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(`**${video.title}**`)
                    .setValue(video.title);
            });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Select an option...')
                .addOptions(selectOptions);

            const selectRow = new ActionRowBuilder()
                .addComponents(selectMenu);

            await interaction.reply({
                content: 'Choose your song:',
                components: [selectRow],
            });

        }
        catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while searching for videos.');
        }

    },
};

