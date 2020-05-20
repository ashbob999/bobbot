
const util = require("./util");

let commands = {}

/*
Command syntax

commands.commandName = {
	func: commandFunction,
	whitelist: {
		"channelName": undefined,
	},
	params: 0,
	desc: "description",
	usage: "usage",
}

params and whitelist are optional

*/

commands.start = {
	func: util.Times.start,
	whitelist: {
		"shit-talk": undefined,
		"bot-channel": undefined,
	},
	desc: "Starts the timer",
	usage: "--start",
}

commands.stop = {
	func: util.Times.stop,
	whitelist: {
		"shit-talk": undefined,
		"bot-channel": undefined,
	},
	desc: "Stops the timer",
	usage: "--stop",
}

Object.freeze(commands);

module.exports = {
	Commands: commands,
}
