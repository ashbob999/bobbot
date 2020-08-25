"use strict"

const times_whitelist = {
	"shit-talk": undefined,
	"bot-channel": undefined,
	"bot-testing": undefined,
};

module.exports = {
	name: "times",
	sub: true,
	func: "",
	admin: false,
	help: "Runs all the time commands",
	usage: "",
	aliases: [],
	whitelist: undefined,

	cmds: {
		start: require("./start.js"),
		stop: require("./stop.js"),
		clean: require("./clean.js"),
	},
};