
const db = require("./Database.js");

const max_time = 3600; // 1 hour

function start(msg) {
	// does not update start_time after multiple --start's
	
	let query = `
INSERT INTO times (user_id,
				   start_time)
SELECT '${msg.author.id}', '${db.dateTime()}'
WHERE NOT EXISTS (
	SELECT 1
	FROM times
	WHERE user_id = '${msg.author.id}'
	AND time_taken is NULL
);
`;

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

	let query = `
WITH start_row AS
(
	SELECT id,
		(extract(epoch
			from to_timestamp('${end_time}', 'YYYY-MM-DD HH24-MI-SS'))
		 - extract(epoch
			from start_time))
		AS time_diff
	FROM times
	WHERE user_id = '${msg.author.id}'
		AND time_taken IS NULL LIMIT 1
)
, deleted AS
(
	DELETE
	FROM times
	WHERE id = (
			SELECT id
			FROM start_row
			LIMIT 1)
		AND (
			SELECT time_diff
			FROM start_row
			LIMIT 1) > ${max_time}
)

UPDATE times
SET time_taken = time_diff
FROM start_row
WHERE times.id = start_row.id
	AND time_diff <= ${max_time}
RETURNING time_taken
;`;

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
	
	let query = `
WITH summed_time AS
(
	SELECT user_id,
		   sum(time_taken) AS total_time
	FROM times
	GROUP BY user_id
)
, del_id AS
(
	SELECT id
	FROM (
		SELECT id,
		rank() OVER (
			PARTITION BY user_id
			ORDER BY time_taken DESC
		)
		FROM times
		WHERE time_taken IS NOT NULL
	) filtered
	WHERE RANK > 1
)
, updated AS
(
	UPDATE times SET time_taken = st.total_time
	FROM summed_time AS st
	WHERE times.user_id = st.user_id
		AND time_taken IS NOT NULL
)

DELETE
FROM times
WHERE id IN (
	SELECT id
	FROM del_id
) ;`;

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