
const db = require("./Database.js");
const tq = require("./TimesQuery.js");

const max_time = 3600; // 1 hour

function start(msg) {
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

function stop(msg) {
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

function cancel(msg) {
	console.log("cancel");
}

function clean(msg) {
	console.log("clean");

	let query = tq.clean.format();

	let result = db.getRows(query, (r,e) => {
		if (!e) {
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
	name: "Times.js",
	start,
	stop,
	cancel,
	clean,
}