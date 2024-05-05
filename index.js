//Require necessary nodes for finding commands directory
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes and get token from "config.json"
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

//Create a new client instance
const client = new Client({ 
    partials: [
		Partials.Channel,
	],
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
    ],
});

//Creates object with collection class for storing/retrieving commands
client.commands = new Collection();

//Constructs path to commands directory using "path.join" (from current directory to commands)
const foldersPath = path.join(__dirname, 'commands');
//Reads the path to the directory stored in "foldersPath" and returns array of all the folder names it contains
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
    //Returns name of every file in utility folder filtering out any file that does not end with .js using Array.filter()
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		//Set each command into client.commands collection, check that each file being loaded has at least the data and execute properties
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//Log in to Discord with your client's token
client.login(token);