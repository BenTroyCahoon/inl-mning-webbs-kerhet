CREATE TABLE users (
    username TEXT,
    password TEXT,
    PRIMARY KEY (username)
);

DROP TABLE users;

INSERT INTO users VALUES ('Benjamin', '123');
INSERT INTO users VALUES ('Caroline', '321');
INSERT INTO users VALUES  ('Jonatan', 'maincoon');

SELECT password FROM users WHERE username = 'benjamin'

DELETE FROM users WHERE username = 'caroline';

INSERT INTO blog_posts (postid, title, content, postdate, username)
VALUES (
    postid:integerINSERT INTO blogposts (postid, title, content, postdate, username)
    VALUES (
        postid:integerINSERT INTO blog_posts (postid, title, content, postdate, username)
        VALUES (
            postid:integer,
            'title:character varying',
            'content:text',
            'postdate:timestamp without time zone',
            'username:text'
          );,
        'title:character varying',
        'content:text',
        'postdate:timestamp without time zone',
        'username:text'
      );,
    'title:character varying',
    'content:text',
    'postdate:timestamp without time zone',
    'username:text'
  );CREATE TABLE blog_posts (
    PostID SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    PostDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Username TEXT,
    FOREIGN KEY (username) REFERENCES users(username)
);
INSERT INTO blogposts (postid, title, content, postdate, username)
VALUES (
    postid:integer,
    'title:character varying',
    'content:text',
    'postdate:timestamp without time zone',
    'username:text'
  );
CREATE TABLE blog_posts (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    PostDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Username TEXT,
    FOREIGN KEY (username) REFERENCES users(username)
);




