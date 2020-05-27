
const keywords = [
	"id",
	"time",
	"max_time",
]

const start = `
INSERT INTO times (user_id,
				   start_time)
SELECT '{id}', '{time}'
WHERE NOT EXISTS (
	SELECT 1
	FROM times
	WHERE user_id = '{id}'
	AND time_taken is NULL
) ;
`;

const stop = `
WITH start_row AS
(
	SELECT id,
		(extract(epoch
			from to_timestamp('{time}', 'YYYY-MM-DD HH24:MI:SS'))
		 - extract(epoch
			from start_time))
		AS time_diff
	FROM times
	WHERE user_id = '{id}'
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
			LIMIT 1) > {max_time}
)

UPDATE times
SET time_taken = time_diff
FROM start_row
WHERE times.id = start_row.id
	AND time_diff <= {max_time}
RETURNING time_taken ;
`;

const clean = `
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
) ;
`;

const show_all = `
SELECT user_id,
	   sum(time_taken) AS total_time
FROM times
GROUP BY user_id
ORDER BY total_time
;
`;

const show_user = `
SELECT sum(time_taken) AS total_time
FROM times
WHERE user_id = '{id}'
;
`;

module.exports = {
	keywords,
	start,
	stop,
	clean,
	show_all,
	show_user,
}
