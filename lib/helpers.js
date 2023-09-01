function isYoutubeUrl(url) {
    // Regex pattern for YouTube video URLs
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&\S*)?$/;

    // Check if the URL matches the pattern
    return youtubePattern.test(url);
}
function getVideoId(url) {
    // Extract ID from the URL
    const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch[1];
    return videoId;
}
module.exports = {
    isYoutubeUrl,
    getVideoId,
};