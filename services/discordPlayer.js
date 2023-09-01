const { EmbedBuilder } = require('@discordjs/builders');
const youtubeSearch = require('yt-search');

async function youtubeSearchByText(songName, resultCount = 1) {
    if (resultCount < 1) {
        throw new Error('Result count must be greater than 0');
    }
    const result = await youtubeSearch(songName);
    return resultCount > 1 ? result.videos.slice(0, resultCount) : result.videos[0];
}

async function youtubeSearchById(urlId) {
    const result = await youtubeSearch({ videoId: urlId });
    return result;
}

function convertToEmbeds(songs, user) {

    return songs.map((song) => {
        const embed = new EmbedBuilder();
        embed.setFields(
            { name: 'Title', value: song.title },
            { name: 'URL', value: song.url },
            { name: 'Thumbnail', value: song.thumbnail },
            { name: 'Description', value: song.description },
        );
        if (user) {
            embed.setFooter({ text: user.username });
        }
        return embed;
    });
}
module.exports = {
    youtubeSearchByText,
    convertToEmbeds,
    youtubeSearchById,
};
