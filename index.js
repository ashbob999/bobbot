"use strict"
require('dotenv').config();

// create http server

const http = require("http");

let server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/plain");

	switch (req.url) {
		case "/kill": // kills the bot
			res.writeHead(200);
			console.log("load /kill");
			process.exit();
			break;
		case "/": // handles the root
			res.writeHead(200);
			res.end("Bot is On");
			console.log("load ");
			break;
		default: // any other path
			res.writeHead(404);
			res.end("404 Error");
			console.log("404: ", req.url);
	}

	//res.end("Bot is On");
});

server.listen(process.env.PORT || 8080);

// http server end

// import all of the extended functions
require("./ExtendedFunctions.js");

const Discord = require("discord.js")

const bot = new Discord.Client();

const TOKEN = process.env.DEV == "true" ? process.env.TEST_BOT : process.env.BOB_BOT;

const config = {
	prefix: "--",
}

// require the command helper file
const commandHandler = require("./commandHelper.js");

const fs = require("fs");

// setup commands to an empty collection
bot.commands = new Discord.Collection();
// holds the main command names
bot.mainCommands = new Set();

// load commands from files
const commandLoader = require("./commandLoader.js");

commandLoader.load(bot);
commandLoader.loadSubs(bot);

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

	let info = {
		message: msg,
		arguments: args,
		content: content,
	};
	
	let error = commandHandler(bot, info);

	switch (error) {
		case commandErrors.INVALID_COMMAND:
			msg.channel.send(`Invalid Command \`${args[0]}\``);
			break;
		case commandErrors.INVALID_SUB_COMMAND:
			msg.channel.send(`Invalid Sub Command: \`${args[0]}\` for main command \`${info.parentCmd}\``);
			break;
		case commandErrors.REQUIRES_ADMIN:
			msg.channel.send(`Command \`${args[0]}\` requires Admin permission`);
			break;
		case commandErrors.REQUIRES_ADMIN_SUB:
			msg.channel.send(`Command \`${info.parentCmd} ${args[0]}\` requires Admin permission`);
			break;
		default:
			break;
	}

	console.log(error);
});
