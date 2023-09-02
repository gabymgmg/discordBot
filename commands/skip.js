const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Ya me canse de esta cancion del diablo rey'),

    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply('Cual cancion tu quiere que skipie, mamañema? No hay nada');
        }
        else {
            queue.node.skip();
        }

        await interaction.reply('Listo, skipiao');
    },
};