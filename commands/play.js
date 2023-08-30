/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const ytSearch = require('yt-search');
const player = useMainPlayer();


module.exports = {
    data: new SlashCommandBuilder()
        // search subcommand
        .setName('play')
        .setDescription('Plays a song from Youtube'),

    execute: async ({ client, interaction }) => {
        await interaction.reply('playing');

    },
};

