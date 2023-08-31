const youtubeSearch = require('yt-search');
async function youtubeSearchByText(songName, resultCount = 1) {
    if (resultCount < 1) {
        throw new Error('Result count must be greater than 0');
    }
    const result = await youtubeSearch(songName);
    return resultCount ? result.videos.slice(0, resultCount) : result.videos[0];
}

module.exports = {
    youtubeSearchByText,
};
