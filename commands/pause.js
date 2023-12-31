const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the song'),

    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply('There\'s no song to pause');
        }
        else {
            queue.node.setPaused(!queue.node.isPaused());
        }
        await interaction.reply('Song paused');
    },
};