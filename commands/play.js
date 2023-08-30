/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from Youtube')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The name/link of the song')
                .setRequired(true)),
    execute: async (interaction) => {
        const input = interaction.options.getString('input');
        // check if input is a link


        await interaction.deferReply();
        await wait(3000);
        await interaction.followUp('Embed message');

    },
};

