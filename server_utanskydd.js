import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import pgSession from "connect-pg-simple";
import bcrypt from "bcrypt";
import helmet from "helmet";
import crypto from "crypto";
const app = express();
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "kukeni3",
  port: 5432,
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// //DÅ jag vill spara sessions i min SQLdb så har jag laddant ner "connect pg-simple" och
// //då ockås lagt till en ny TABLE is SQL som heter sessions.
const PgSession = pgSession(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "sessions", // Använd det namn du gav din sessionstabell
    }),
    secret: "mySafeSecret",
    saveUninitialized: false,
    resave: false,
    cookie: { expires: 20 * 60 * 1000 },
    sameSite: "strict",
  })
);

async function getAllUsers() {
  try {
    const result = await pool.query("SELECT * FROM users");
    console.log("List of users:", result.rows);
  } catch (err) {
    console.error(err);
  }
}
getAllUsers();

app.get("/protected", async (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();

    //console.log("vad sker");
    const { userID } = req.session;
  } else {
    res.status(401).send("Ap, Ap, Ap! You are not permitted here loser.");
  }
});

// HÄR SKULLE EN MÖJLIG XXS-ATTACK UTFÖRAS.
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
});

try {
  const hashedPassword = await bcrypt.hash(password, 10); // Kryptera lösenordet med bcrypt

  // Lägg till den nya användaren med det krypterade lösenordet i databasen
  await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    username,
    password,
  ]);

  // Skicka en respons till klienten
  res.status(200).send("Användare registrerad!");
} catch (error) {
  console.error(error);
  res.status(500).send("Något gick fel vid registreringen");
}

const authenticate = (req, res, next) => {
  // console.log('req.session:', req.session);
  if (req.session.isLoggedIn) {
    return next();
  } else {
    //console.log(req.session, req.session.authenticated)
    return res
      .status(401)
      .send("FUCK du är Unauthorized, du är inne i authenticate");
  }
};

// Middleware som verifierar att det skickas med samma token som genererades för sessionen.
function verifyCsrfToken(req, res, next) {
  console.log(req.body);
  if (req.session.csrfToken === req.body._csrf) {
    next();
  } else {
    res.status(400).send("Invalid CSRF-token");
  }
}

app.get("/csrf", authenticate, (req, res) => {
  res.send(req.session.csrfToken);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      const hashedPassword = user.password; // Hämta det krypterade lösenordet från databasen
      const match = await bcrypt.compare(password, hashedPassword);

      if (match) {
        const csrfToken = crypto.randomBytes(64).toString("hex"); //En lång random sträng.
        req.session.csrfToken = csrfToken; // Token knyts till den aktuella sessionen.
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.redirect("/protected");

        console.log("Inloggad som:", username);
      } else {
        res.status(401).send("Fel lösenord eller användarnamn");
      }
    } else {
      res.status(401).send("Fel lösenord eller användarnamn");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Något gick fel vid inloggningen");
  }
});

// Första steget är att få en access code från GitHub.
// Vi omdirigerar requests till Github där man sedan får logga in.
app.get("/auth/github", (_req, res) => {
  const authUrl =
    "https://github.com/login/oauth/authorize?client_id=70b571bcf865f22f2d34"; //Client ID finns i inställningarna för GitHub.
  res.redirect(authUrl);
});

// Hit kommer vi med en kod som kan användas för att bytas mot en token.
app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;

  // Här får vi själva access_token
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: "70b571bcf865f22f2d34",
      client_secret: "7b647a50ae4d0a6ea1a6499dc471362c601973b4", //Din nyckel
      code: code,
    }),
    // Vi vill ha vår token i JSON-format
    headers: {
      Accept: "application/json",
    },
  });
  const jsonResponse = await response.json();
  const userInfo = await getUserInfoFromGitHub(jsonResponse.access_token);

  const csrfToken = crypto.randomBytes(64).toString("hex"); //En lång random sträng.
  req.session.csrfToken = csrfToken; // Token knyts till den aktuella sessionen.
  req.session.username = userInfo.login;
  req.session.isLoggedIn = true;

  const userExist = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [userInfo.login]
  );

  if (userExist.rows.length === 0) {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      userInfo.login,
      "githubuser",
    ]);
  }

  res.redirect("/protected");
  console.log(req.session.username);
});

const getUserInfoFromGitHub = async (access_token) => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await response.json();
};

app.get("/users", authenticate, (req, res) => {
  if (req.session.isLoggedIn) {
    const userID = req.session.userID; // Hämta användare från session

    pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userID],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error fetching user data");
        } else {
          const user = result.rows[0];
          res.json({ username: user.username });
        }
      }
    );
  } else {
    res.status(401).send("Not logged in");
  }
});

app.get("/getposts", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blog_posts ORDER BY created_at"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching blog posts");
  }
});

// HÄR SKULLE EN MÖJLIG XXS-ATTACK UTFÖRAS.
app.post("/addpost", authenticate, verifyCsrfToken, async (req, res) => {
  const { title, content } = req.body;
  const author = req.session.username;
  if (!title || !content) {
    return res
      .status(400)
      .send("DU behöver lägga till titel och/eller innehåll förstår du väl");
  }
});

try {
  await pool.query(
    "INSERT INTO blog_posts (title, content, author, created_at) VALUES ($1, $2, $3, NOW())",
    [cleanTitle, cleanContent, author]
  );

  res.status(200).send("Succé! Nya inlägget är uppe");
  console.log("Succé! Nya inlägget är uppe");
} catch (error) {
  console.error(error);
  res
    .status(500)
    .send("Något blev fel när du skulle ladda upp inlägget. Testa igen");
}

app.delete("/deletepost/:postId", async (req, res) => {
  const postId = req.params.postId;
  const loggedInUser = req.session.username;
  // OM po
  try {
    // Kontrollera om inloggad användare har rollen "admin"
    const author = await pool.query(
      "SELECT author FROM blog_posts WHERE id = $1",
      [postId]
    );
    if (!author || author.rows.length === 0) {
      return res.status(400).send("Post ID not found");
    }

    const authorResult = author.rows[0].author;

    const userRoleResult = await pool.query(
      "SELECT role FROM users WHERE username = $1",
      [loggedInUser]
    );
    const userRole = userRoleResult.rows[0].role;

    if (userRole === "admin" || loggedInUser == authorResult) {
      await pool.query("DELETE FROM blog_posts WHERE id = $1", [postId]);
      res.status(200).send("Blogginlägget har tagits bort framgångsrikt");
    } else {
      // Om användaren inte har rollen "admin", neka borttagning
      res.status(403).send("Du har inte behörighet att ta bort detta inlägg");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Det gick inte att ta bort blogginlägget");
  }
});

app.get("/user", authenticate, (req, res) => {
  if (req.session.username) {
    res.json({ msg: `Inloggad som ${req.session.username}` });
  } else {
    res.json({ msg: "Ingen användare är inloggad" });
  }
});

//HÄR SKULLE EN MÖJLIG XXS-ATTACK UTFÖRAS.
"/addcomment/:postId",
  authenticate,
  verifyCsrfToken,
  async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    if (!postId || !content) {
      return res.status(400).send("Bad request");
    }
    const author = req.session.username;

    try {
      await pool.query(
        "INSERT INTO comments (post_id, username, content) VALUES ($1, $2, $3)",
        [postId, author, content]
      );

      // res.status(200).send("Comment added successfully");
      res.redirect("/protected");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error adding comment");
    }
  };

app.get("/getcomments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // Kontrollera om posten finns
    const postResult = await pool.query(
      "SELECT * FROM blog_posts WHERE id = $1",
      [postId]
    );

    if (postResult.rowCount === 0) {
      // Posten finns inte, skicka ett felmeddelande
      res.status(404).send("Post not found");
      return;
    }

    // Posten finns, hämta kommentarerna
    const result = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY comment_date DESC",
      [postId]
    );

    res.json({ comments: result.rows, csrf: req.session.csrfToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching comments");
  }
});

app.get("/logout", (req, res) => {
  console.log("inne i logout");
  req.session.destroy();
  console.log("hejdå");
  res.redirect("/");
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server rullar 3000");
});
