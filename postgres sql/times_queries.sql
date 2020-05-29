Start:
INSERT INTO times (user_id,
				   start_time)
SELECT 'msg.author.id',
	   'db.dateTime()'
WHERE NOT EXISTS (
	SELECT 1
	FROM times
	WHERE user_id = 'msg.author.id'
	AND time_taken is NULL
);


Stop:
WITH start_row AS
(
	SELECT id,
		(extract(epoch
			from to_timestamp('end_time', 'YYYY-MM-DD HH24-MI-SS'))
		 - extract(epoch
			from start_time))
		AS time_diff
	FROM times
	WHERE user_id = 'msg.author.id'
		AND time_taken IS NULL LIMIT 1;
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
			LIMIT 1) > 3600
)

UPDATE times
SET time_taken = time_diff
FROM start_row
WHERE times.id = start_row.id
	AND time_diff <= 3600
RETURNING time_taken
;


Clean up:
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


show:
SELECT user_id,
	   sum(time_taken) AS total_time
FROM times
GROUP BY user_id
ORDER BY total_time
;
