const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the song'),

    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply('There\'s no song to skip');
        }
        else {
            queue.node.skip();
        }

        await interaction.reply('Song skipped');
    },
};