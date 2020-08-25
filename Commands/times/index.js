"use strict"

const times_whitelist = {
	"shit-talk": undefined,
	"bot-channel": undefined,
	"bot-testing": undefined,
};

function base(bot, info) {
}

module.db = require("../../util/Database.js");
module.timesQuery = require("./TimesQuery.js");

module.exports = {
	name: "times",
	sub: true,
	func: base,
	admin: false,
	help: "Runs all the time commands",
	usage: "--times [start/stop/clean]",
	aliases: [],
	whitelist: times_whitelist,

	cmds: {
		start: require("./start.js"),
		stop: require("./stop.js"),
		clean: require("./clean.js"),
	},
};