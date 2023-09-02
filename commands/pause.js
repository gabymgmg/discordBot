const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Aguanta'),

    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply('No hay nada que pausar, mamañema');
        }
        else {
            queue.node.setPaused(!queue.node.isPaused());
        }
        await interaction.reply('Listo, pausao');
    },
};