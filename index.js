require('dotenv').config();

// formats a string
String.prototype.format = String.prototype.format ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }
    return str;
};

// copys a string
String.prototype.copy = String.prototypecopy ||
function () {
	"use strict"
	var str = this.toString();
	return (" " + str).slice(1);
}

const util = require("./util");

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

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    
	// loops through each server the bot is in
    for (let [key, value] of bot.guilds) {
		//loops through each channel the bot is in
    	for (let [channelId, channel] of value.channels) {
    		// loops through each command
			for (let cmd in commands) {
				let wl = commands[cmd].whitelist;
				// if cmd is in the whitelist
				if (channel.name in wl) {
					// bind channelId to channel name
					commands[cmd].whitelist[channel.name] = channelId;
				}
			}
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
	
	// if help command sent
	if (args[0] == "help") {
		util.Help.showHelp(msg, args);
		return;
	}

	if (args[0] in commands) {
		// handle the command
		commandHandler(msg, args, content, false);
	} else { // not a valid command
		msg.reply("Invalid command!");
	}

    // msg.channel.send() without @
});
