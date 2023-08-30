// Load environment variables
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
// Discord libraries
const { Client, GatewayIntentBits, Collection } = require('discord.js');
// const { Player, GuildNodeManager } = require('discord-player');
// const { YouTubeExtractor } = require('@discord-player/extractor');


// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});


// Loading command files
client.commands = new Collection();
// // reads the path to the directory and returns an array of all the file names it contains
const commandsPath = path.join(__dirname, 'commands');
// // removes any non JS file
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Log in to Discord with the bot's token
client.login(process.env.TOKEN);
