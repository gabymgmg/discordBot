const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),

    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, interaction }) => {
        await interaction.reply('song paused');
    },
};