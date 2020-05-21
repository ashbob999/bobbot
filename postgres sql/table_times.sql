CREATE TABLE times(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  time_taken INT
);