"use strict"

const db = module.parent.db;
const tq = module.parent.timesQuery;

function start(bot, info) {
	let msg = info.message;

	// does not update start_time after multiple --start's

	let query = tq.start.format({
		id: msg.author.id,
		time: db.dateTime(),
	});

	let result = db.getRows(query, (r,e) => {
		if (!e) {
			if (r.rowCount > 0) { // insert worked
				msg.reply("time started.");
			}
		}else {
			throw e;
		}
	});
}

module.exports = {
	name: "start",
	func: start,
	admin: false,
	help: "Starts the timer",
	usage: "",
	aliases: [],
	whitelist: undefined,
}