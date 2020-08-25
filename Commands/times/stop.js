"use strict"

const db = module.parent.db;
const tq = module.parent.timesQuery;

const max_time = 3600; // 1 hour

function stop(bot, info) {
	let msg = info.message;

	let end_time = db.dateTime();

	let query = tq.stop.format({
		time: end_time,
		id: msg.author.id,
		max_time: max_time,
	});

	let result = db.getRows(query, (r,e) => {
		if (e) throw e;
		
		if (r.rowCount > 0) { // success
			msg.reply("you took " + r.rows[0].time_taken + " seconds");
		} else {
			// either:
			// 1: start hasn't been called
			// 2: time_taken is > 3600
		}
	});
}

module.exports = {
	name: "stop",
	func: stop,
	admin: false,
	help: "Stops the timer",
	usage: "",
	aliases: [],
	whitelist: undefined,
}