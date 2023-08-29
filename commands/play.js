const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { useQueue,useMainPlayer, GuildQueue, GuildNodeManager } = require("discord-player");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const player = useMainPlayer();


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
        // song url subcommand
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
        const guild = interaction.guild
        console.log("Received interaction ID:", voiceChannel);

        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        //retrieve the guildManager
        const guildManager = client.GuildNodeManager;
        let queue = useQueue(interaction.guild.id);

        // check if there's an existing queue
        if(!queue){
            queue = await guildManager.create(guild, { volume: 6 });
            client.GuildQueue = queue;
        }
        //connect the queue to the voice channel
        await queue.connect(voiceChannel, {deaf:false});
        console.log('this is the queue: ', queue)

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

                    const track = {
                        title: song.title,
                        url: song.url,
                        duration: song.duration.seconds,
                        thumbnail: song.image,
                        requestedBy: user
                    };
                    queue.addTrack(track)
                    console.log('TRACKSS',queue.tracks)
                    // Creating the embed message to send to the channel
                    embed
                        .setTitle('Song Added to Queue')
                        .setDescription(`Added **[${song.title}](${song.url})** to the queue!`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({
                            text: `Requested by ${user}`,
                            iconURL: interaction.user.displayAvatarURL()
                        });
                        console.log(embed)
                        if (!queue.isPlaying()) {
                            try {
                                console.log('current track: ', track)
                                await queue.play(track.url);
                            } catch (error) {
                                console.error("An error occurred during playback:", error);
                            }
                        }
                });
            }
            catch (err) {
                console.error("Error searching for the song:", err);
                return interaction.reply("An error occurred while searching for the song.");
            }
        }


        // Execution for play song url command
        else if (interaction.options.getSubcommand() === "song") {
            const url = interaction.options.getString("url");
            console.log(url)
            // Extract ID from the URL
            const videoIdMatch = await url.match(/v=([a-zA-Z0-9_-]{11})/);
            console.log('urlID', videoIdMatch)

            const urlID = videoIdMatch[1]

            try {
                // Search for the song
                ytSearch({ videoId: urlID }, async (err, result) => {
                    if (err) {
                        console.error("Error searching for the song:", err);
                        return interaction.reply("An error occurred while searching for the song.");
                    }

                    // result from the ytSearch
                    const song = result

                    if (!song || song.length === 0) {
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
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        });
                        console.log(embed)
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
        await interaction.reply({embeds:[embed.data]})
    },
};

