function isYoutubeUrl(url) {
    const lowerUrl = url.toLowerCase();

    // Check if the URL contains the necessary components
    const isYouTubeWatchUrl = lowerUrl.includes('youtube.com/watch?v=');
    const isYouTubeShortUrl = lowerUrl.includes('youtu.be/');

    return isYouTubeWatchUrl || isYouTubeShortUrl;
}

module.exports = {
    isYoutubeUrl,
};