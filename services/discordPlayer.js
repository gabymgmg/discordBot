const { EmbedBuilder } = require('@discordjs/builders');
const youtubeSearch = require('yt-search');
async function youtubeSearchByText(songName, resultCount = 1) {
    if (resultCount < 1) {
        throw new Error('Result count must be greater than 0');
    }
    const result = await youtubeSearch(songName);
    return resultCount ? result.videos.slice(0, resultCount) : result.videos[0];
}

function convertToEmbeds(songs, user) {
    return songs.map((song) => {
        const embed = new EmbedBuilder();
        embed.setFields(
            { name: 'title', value: song.title },
            { name: 'url', value: song.url },
            { name: 'thumbnail', value: song.thumbnail },
            { name: 'description', value: song.description },
        );
        if (user) {
            embed.setFooter({ text: user.username });
        }
    });
}
module.exports = {
    youtubeSearchByText,
    convertToEmbeds,
};
