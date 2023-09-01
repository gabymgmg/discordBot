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

async function getReply(interaction, customId) {
    try {
        const collectorFilter = i => i.user.id === interaction.user.id;
        const confirmation = await interaction.channel.awaitMessageComponent({ filter: collectorFilter, time: 40000 });

        if (confirmation.customId === customId) {
            const selectedSong = confirmation.values[0];
            return selectedSong;
        }
    }
    catch (error) {
        console.error(error);
        await interaction.followUp({ content: 'Confirmation not received within 1 minute, cancelling' });
    }
}
module.exports = {
    isYoutubeUrl,
    getVideoId,
    getReply,
};