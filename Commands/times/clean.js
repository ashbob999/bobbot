"use strict"

const db = module.parent.db;
const tq = module.parent.timesQuery;

function clean(bot, info) {
	let msg = info.message;

	console.log("clean");

	let query = tq.clean.format();

	let result = db.getRows(query, (r,e) => {
		if (e) {
			msg.reply("failed to clean the database!");
			return;
		}

		if (r.rowCount > 0) {
			msg.reply("Cleaned " + r.rowCount + " rows from the database.");
		} else {
			msg.reply("no rows to clean.");
		}
	});
}

module.exports = {
	name: "clean",
	func: clean,
	admin: true,
	help: "Cleans the database",
	usage: "",
	aliases: [],
	whitelist: undefined,
}