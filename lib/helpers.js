function isYoutubeUrl(url) {
    // Regex pattern for YouTube video URLs
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&\S*)?$/;

    // Check if the URL matches the pattern
    return youtubePattern.test(url);
}

module.exports = {
    isYoutubeUrl,
};