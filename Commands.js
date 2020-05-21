
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

let times_whitelist = {
	"shit-talk": undefined,
	"bot-channel": undefined,
}

commands.start = {
	func: util.Times.start,
	whitelist: times_whitelist,
	desc: "Starts the timer",
	usage: "--start",
}

commands.stop = {
	func: util.Times.stop,
	whitelist: times_whitelist,
	desc: "Stops the timer",
	usage: "--stop",
}

commands.cancel = {
	func: util.Times.cancel,
	whitelist: times_whitelist,
	desc: "Cancels the timer",
	usage: "--cancel",
}

Object.freeze(commands);

module.exports = {
	Commands: commands,
}
