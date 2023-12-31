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
        embed
            .setTitle('Song Added to Queue:')
            .setDescription(`**[${song.title}](${song.url})**`)
            .setThumbnail(song.thumbnail)
            .setFooter({
                text: `Requested by ${user.username}`,
                iconURL: user.displayAvatarURL(),
            })
            .setColor([2, 216, 224]);

        return embed;
    });
}


module.exports = {
    youtubeSearchByText,
    convertToEmbeds,
    youtubeSearchById,
};
