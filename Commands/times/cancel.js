"use strict"

const db = module.parent.db;
const tq = module.parent.timesQuery;

function cancel(bot, info) {
	let msg = info.message;

	let query = tq.cancel.format({
		id: msg.author.id,
	});

	let result = db.getRows(query, (r, e) => {
		if (!e) {
			if (r.rowCount > 0) {
				msg.reply("Time Cancelled.");
			} else {
				// no time to cancel
			}
		} else {
			throw e;
		}
	});
}

module.exports = {
	name: "cancel",
	func: cancel,
	admin: false,
	help: "Cancel the timer",
	usage: "",
	aliases: [],
	whitelist: undefined,
}