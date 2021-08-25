"use strict"

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
	whitelist: ["times"],

	cmds: {
		start: require("./start.js"),
		stop: require("./stop.js"),
		cancel: require("./cancel.js"),
		clean: require("./clean.js"),
		show: require("./show.js"),
	},
};
