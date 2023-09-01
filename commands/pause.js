const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),

    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        queue.node.setPaused(!queue.node.isPaused());
        await interaction.reply('Song paused');
    },
};