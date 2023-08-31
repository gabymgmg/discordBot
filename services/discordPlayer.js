const { EmbedBuilder } = require('@discordjs/builders');
const youtubeSearch = require('yt-search');
const { isYoutubeUrl } = require('../lib/helpers');
const { getVideoID } = require('ytdl-core');

async function youtubeSearchByText(songName, resultCount = 1) {
    // check if it's a songName or link
    const isUrl = isYoutubeUrl(songName);
    if (!isUrl) {
        songName = getVideoID(songName);
    }
    if (resultCount < 1) {
        throw new Error('Result count must be greater than 0');
    }
    const result = await youtubeSearch(songName);
    return resultCount > 1 ? result.videos.slice(0, resultCount) : result.videos[0];
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
        return embed;
    });
}
module.exports = {
    youtubeSearchByText,
    convertToEmbeds,
};
