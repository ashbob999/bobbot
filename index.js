require('dotenv').config();

// import all of the extended functions
require("./ExtendedFunctions.js");

//const util = require("./util");

const Discord = require("discord.js")

const bot = new Discord.Client();

const TOKEN = process.env.DEV == "true" ? process.env.TEST_BOT : process.env.BOB_BOT;

const adminId = "445907614480728065";

const config = {
	prefix: "--",
}

const commands = require("./Commands.js").Commands;

// require the command helper file
const commandHandler = require("./commandHelper.js");

const fs = require("fs");

// setup commands to an empty collection
bot.commands = new Discord.Collection();

// get list of .js files from command folder
// excludes .js files thatbstart with and underscore
const commandFiles = fs.readdirSync('./commands')
					   .filter(file => file.endsWith('.js') && !file.startsWith("_"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}

const commandErrors = require("./util/ErrorTypes.js");

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    
	// loops through each server the bot is in
    for (let [key, value] of bot.guilds) {
		//loops through each channel the bot is in
    	for (let [channelId, channel] of value.channels) {
    		// loops through each command
			bot.commands.forEach((v, k) => {
				// does the command have a whitelist
				if (v.whitelist) {
					// if channel name is in the whitelist
					if (channel.name in v.whitelist) {
						// bind channelId to channel name
						v.whitelist[channel.name] = channelId;
					}
				}
			});
		}
    }
});

bot.on('message', msg => {
	
	// don't reply to other bots
	if (msg.author.bot) {
		return;
	}
	
	// get the message text
	let content = msg.content;
	
	// return if the message does not start with the prefix
	if (!content.startsWith(config.prefix)) {
		return;
	}
	
	// remove the prefix
	content = content.slice(config.prefix.length).trim();
	
	// split content by spaces
	let args = content.split(/ +/);
	
	// get message author
	let author = msg.author;
	
	//console.log(msg.content.split(Discord.MessageMentions.USERS_PATTERN));
	
	/*
	if (msg.mentions.users.has(bot.user.id)) {
		console.log("mention");
	}
	*/
	
	/* no longer works
	// if help command sent
	if (args[0] == "help") {
		util.Help.showHelp(msg, args);
		return;
	}
	*/

	let info = {
		message: msg,
		arguments: args,
		content: content,
	};
	
	let error = commandHandler(bot, info);

	console.log(error);
});
