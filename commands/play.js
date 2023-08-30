/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder } = require('discord.js');
const ytSearch = require('yt-search');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from Youtube')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The name/link of the song')
                .setRequired(true)),
    execute: async (interaction) => {
        await interaction.deferReply();
        await wait(4000);
        await interaction.followUp('Embed message');

    },
};

