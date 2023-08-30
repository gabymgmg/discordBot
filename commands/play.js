/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder } = require('discord.js');
const { isYoutubeUrl } = require('../lib/helpers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from Youtube')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The name/link of the song')
                .setRequired(true)),
    execute: async (interaction) => {
        // Making sure the user is inside a voice channel
        const voiceChannel = interaction.member.voice.channel;
        const guild = interaction.guild;
        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }
        // Getting the input and checking if it is a YT link
        const input = interaction.options.getString('input');
        const isYTLink = isYoutubeUrl(input);

        // Replying
        await interaction.deferReply();
        await wait(2500);
        await interaction.followUp('Embed message');

    },
};

