DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS user_lessons;


CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE,
	username VARCHAR(255) NOT NULL,
	password_digest VARCHAR(255) NOT NULL,
	image VARCHAR(255) NOT NULL,
	fname VARCHAR(50) NOT NULL,
	lname VARCHAR(50) NOT NULL,
	admin BOOLEAN NOT NULL,
	current_lesson VARCHAR(55) NOT NULL
);

CREATE TABLE lessons (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	file VARCHAR(255) NOT NULL,
	active BOOLEAN NOT NULL
);


-- user table will have a lesson appended to it everytime a lesson is added

-- ALTER TABLE users 
-- ADD COLUMN lesson_1 REFERENCES lesson_1(id) NOT NULL,

CREATE TABLE user_lessons (
	id SERIAL PRIMARY KEY,
	user_id INT UNIQUE REFERENCES users(id) 
	ON UPDATE CASCADE 
	ON DELETE CASCADE NOT NULL,
	lesson_1_id INT UNIQUE REFERENCES lessons(id)
	ON UPDATE CASCADE 
	ON DELETE CASCADE NOT NULL,
	lesson_1_status BOOLEAN NOT NULL
);

