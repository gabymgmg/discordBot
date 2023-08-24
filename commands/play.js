const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        // search subcommand
        .setName("play")
        .setDescription("Plays a song from Youtube")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Plays a song given the name")
                .addStringOption(option =>
                    option.setName("title").setDescription("Name of the song").setRequired(true)
                )
        )
        // playlist subcommand
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays a song given an url")
                .addStringOption(option =>
                    option.setName("url").setDescription("Song's url").setRequired(true)
                )
        ),

    execute: async ({ client, interaction }) => {
        //Making sure the user is inside a voice channel
        const voiceChannel = interaction.member.voice.channel;
        console.log("Received interaction ID:", interaction.user.id);

        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        const queue = await client.player.queues.create(interaction.guild);

        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }

        let embed = new EmbedBuilder();

        // Execution for play song command
        if (interaction.options.getSubcommand() === "search") {
            const songName = interaction.options.getString("title");
            const user = interaction.user.username;
            try {
                ytSearch(songName, async (err, result) => {
                    if (err) {
                        console.error("Error searching for the song:", err);
                        return interaction.reply("An error occurred while searching for the song.");
                    }
                    // result from the ytSearch
                    const videos = result.videos;
                    if (!videos || videos.length === 0) {
                        return interaction.reply("No song was found.");
                    }

                    const song = videos[0];

                    await queue.addTrack({
                        title: song.title,
                        url: song.url,
                        duration: song.duration.seconds,
                        thumbnail: song.image,
                        requestedBy: user
                    });

                    // Creating the embed message to send to the channel
                    embed
                        .setTitle('Song Added to Queue')
                        .setDescription(`Added **[${song.title}](${song.url})** to the queue!`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({
                        text: `Requested by ${user}`,
                        iconURL: interaction.user.displayAvatarURL()
                        });


                });

                if (!queue.isPlaying()) {
                    try {
                        await queue.play(voiceChannel.id);
                    } catch (error) {
                        console.error("An error occurred during playback:", error);
                    }
                }
            }
            catch (err) {
                console.error("Error searching for the song:", err);
                return interaction.reply("An error occurred while searching for the song.");
            }
        }


        // Execution for play song url command
        else if (interaction.options.getSubcommand() === "url") {
            const url = interaction.options.getString("url");
            console.log(url)
            // Extract playlist ID from the URL
            const videoIdMatch = await url.match(/v=([a-zA-Z0-9_-]{11})/);
            console.log('urlID', videoIdMatch)

            const urlID = videoIdMatch[1]


            try {
                // Search for the playlist 
                ytSearch({ videoId: urlID }, async (err, result) => {
                    if (err) {
                        console.error("Error searching for the playlist:", err);
                        return interaction.reply("An error occurred while searching for the playlist.");
                    }

                    // result from the ytSearch
                    const videos = result.videos
                    const song = videos[0]

                    if (!song|| song.length === 0) {
                        return interaction.reply("No song was found.");
                    }
                    // Loop through the playlist videos and add them to the queue
                    await queue.addTrack({
                        title: song.title,
                        url: song.url,
                        duration: song.duration.seconds,
                        thumbnail: song.image,
                        requestedBy: interaction.user.tag
                    });

                    // Create the embed message
                    embed
                    .setTitle('Song Added to Queue')
                    .setDescription(`Added **[${song.title}](${song.url})** to the queue!`)
                    .setThumbnail(song.thumbnail)
                    .setFooter(`Requested by ${interaction.user.tag}`);
                })

                if (!queue.isPlaying()) {
                    try {
                        await queue.play(voiceChannel.id);
                    } catch (error) {
                        console.error("An error occurred during playback:", error);
                    }
                }
            }
            catch (err) {
                console.error("Error searching for the playlist:", err);
                return interaction.reply("An error occurred while searching for the playlist.");
            }
        }

        // Respond with the embed containing information about the player
        await interaction.reply({ embeds: [embed.data] })
    }
};

