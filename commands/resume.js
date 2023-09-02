const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Vamo de nuevo'),

    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply('No hay nada que resumir, mamañema');
        }
        else {
            queue.node.resume();
        }
        await interaction.reply('Listo, resumio');
    },
};