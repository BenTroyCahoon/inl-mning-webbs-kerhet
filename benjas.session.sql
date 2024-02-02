User




CREATE TABLE blog_posts (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    PostDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Username TEXT,
    FOREIGN KEY (Username) REFERENCES usersINSERT INTO sessions (sid, sess, expire)
    VALUES (
        'sid:character varying',
        'sess:json',
        'expire:timestamp with time zone'
      );(username)
)


CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE blog_posts
ADD COLUMN author VARCHAR(100),
ADD COLUMN timestamp TIMESTAMP;
ALTER TABLE blog_posts
DROP COLUMN timestamp;


DELETE FROM blog_posts WHERE TRUE

DELETE FROM users WHERE TRUE
ALTER TABLE users ADD COLUMN role TEXTALTER TABLE users ADD COLUMN role TEXT

CREATE TABLE sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMPTZ NOT NULL
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_Id INT REFERENCES blog_posts(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username TEXT,
    post_id INT,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
INSERT INTO users (username, password, role)
VALUES (
    'username:text',
    'password:text',
    'role:text'
  );

DELETE FROM users WHERE username = '<script> alert("Hell")</script>';
