/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ytSearch = require('yt-search');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from Youtube'),

    execute: async ({ client, interaction }) => {
        await interaction.reply('playing');

    },
};

