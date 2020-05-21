
const db = require("./Database.js");

function start(msg) {
	let query = "INSERT INTO " +
		"times (user_id, start_time) " +
		"VALUES ('" +
			msg.author.id + "', '" +
			db.dateTime() + "');";

	let result = db.getRows(query, (r,e) => {
	if (!e) {
msg.reply("time started.");
}else {
throw e;
}
});
/*
	if (!result.error) {
		msg.reply("time started.");
	}*/
}

function stop(msg) {
	let end_time = db.dateTime();

	let query = "SELECT id, " +
		"(extract(epoch from " +
			"to_timestamp('" +
				end_time + "', " +
				"'YYYY-MM-DD HH24-MI-SS'))" +
		" - extract(epoch from start_time)) AS time_diff " +
		"FROM times " +
		"WHERE user_id = '" + msg.author.id +
		"' AND time_taken IS NULL LIMIT 1;";

	let result = db.getRows(query, (r,e) => {
		if (e) throw e;
		
		if (!r.rows.length) {
			// no rows
			return;
		}
		console.log(r.rows);
		console.log(end_time);
		
		let query2 = "UPDATE times " +
			"SET time_taken = '" + r.rows[0].time_diff + "' " +
			"WHERE id = '" + r.rows[0].id + "';";

		db.getRows(query2, (r2, e2) => {
			if (e2) throw e2;

			console.log("updated");
			msg.reply("you took " + r.rows[0].time_diff + " seconds");
		});
	});

	if (result.error) {
		throw result.error;
	}

//console.log(result);
	/*
	query = "UPDATE times " +
		"SET end_time = '" +
		end_time + "' " +
		"WHERE id = '" + result.result[0].id + "';";
*/
	
}

function cancel(msg) {
	console.log("cancel");
}

module.exports = {
	name: "Times.js",
	start,
	stop,
	cancel,
}