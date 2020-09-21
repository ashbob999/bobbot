"use strict"

const db = module.parent.db;
const tq = module.parent.timesQuery;

function show(bot, info) {

}

module.exports = {
	name: "show",
	func: show,
	admin: false,
	help: "Shows people's times",
	usage: "show - shows everybody's times\n" +
		   "show <user> - shows specific user times\n" +
		   "show <user1> <user2> - shows multiple users times",
	aliases: [],
	whitelist: undefined,
}