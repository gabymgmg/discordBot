// Load environment variables
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
// Discord libraries
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v10');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const {Player,Extractors} = require('discord-player');
const { YouTubeExtractor } = require('@discord-player/extractor');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
	],
})


// Register the event listener for the "client ready" event
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

//retrieving the command files
const commands = []
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
//reads the path to the directory and returns an array of all the file names it contains
//removes any non JS file
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());

	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Add the player on the client - This is for handling music playback
client.player = new Player(client,{
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
client.player.extractors.register(YouTubeExtractor);


// ensures that the slash commands are available and usable across all servers where the bot is present
client.on("ready", () => {
    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({version: '10'}).setToken(process.env.BOT_TOKEN);
    for (const guildId of guild_ids)
    {
        //Sends a PUT request to the Discord API to register the commands
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
});

//setting up listeners to handling the slash commands 
client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

// Log in to Discord with the bot's token
client.login(process.env.BOT_TOKEN);

