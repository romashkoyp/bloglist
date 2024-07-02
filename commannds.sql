CREATE TABLE blogs (
  id        SERIAL PRIMARY KEY,     --unique, incrementing id
  author    TEXT,                   --string
  url       TEXT NOT NULL,          --string that cannot be empty
  title     TEXT NOT NULL,          --string that cannot be empty
  likes     INTEGER DEFAULT 0       --integer with default value zero
);

INSERT INTO blogs (author, url, title) values ('Martin', 'www.martin.com', 'Live of Martin');
INSERT INTO blogs (author, url, title, likes) values ('Luter', 'www.luter.com', 'Luter from UK', '12');
SELECT * FROM blogs;

INSERT INTO users (username, name) values ('Heikki', 'Helicopter');
SELECT * FROM users;