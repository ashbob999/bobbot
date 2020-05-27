
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
	admin: true,
}

params and whitelist are optional

*/

let times_whitelist = {
	"shit-talk": undefined,
	"bot-channel": undefined,
	"bot-testing": undefined,
};

commands.start = {
	func: util.Times.start,
	whitelist: times_whitelist,
	desc: "Starts the timer",
	usage: "--start",
};

commands.stop = {
	func: util.Times.stop,
	whitelist: times_whitelist,
	desc: "Stops the timer",
	usage: "--stop",
};

commands.cancel = {
	func: util.Times.cancel,
	whitelist: times_whitelist,
	desc: "Cancels the timer",
	usage: "--cancel",
};

commands.clean = {
	func: util.Times.clean,
	whitelist: times_whitelist,
	desc: "Cleans the table, by combining rows",
	usage: "--clean",
	admin: true,
};

commands.show = {
	func: util.Times.show,
	whitelist: times_whitelist,
	desc: "Shows the total times for all users, or specific user",
	usage: "--show [mention]",
}

Object.freeze(commands);

module.exports = {
	Commands: commands,
}
