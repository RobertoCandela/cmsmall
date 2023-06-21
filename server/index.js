"use strict";

const PORT = 3000;
const express = require("express");
const userDao = require("./dao-users");
const pageDao = require("./dao-pages");
const blocksDao = require("./dao-blocks");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");

const app = express();

passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password);
    if (!user) return callback(null, false, "Incorrect username or password");

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
  })
);
passport.serializeUser(function (user, callback) {
  // this user is id + username + name
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  // this user is id + email + name
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
  session({
    secret: "3aBc9D1e8F2gH7jK",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};
app.delete('/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});
app.get("/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});
// Esempio di route che esegue una query sul database
app.get("/users", (req, res) => {
  userDao
    .getAllUsers()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.post(
  "/users",
  [
    check("name").isLength({ min: 1, max: 50 }).withMessage("invalid name"),
    check("surname")
      .isLength({ min: 1, max: 50 })
      .withMessage("invalid surname"),
    check("username")
      .isLength({ min: 1, max: 20 })
      .withMessage("invalid username"),
    check("email").isEmail().withMessage("invalid email"),
    check("password")
      .isStrongPassword()
      .withMessage("password not strong enough"),
  ],
  (req, res) => {
    console.log("printing req...")
    console.log(req);
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    //validazione

    //   if (!req.body.name || !req.body.email) {
    //     return res.status(400).json({ error: "Name and email are required" });
    //   }
    const user = {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isAdmin: `${req.body.isAdmin}`,
    };

    userDao
      .createUser(user)
      .then((resp) => {
        res.status(201).json(resp);
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).json(err);
        }
      });
  }
);
app.get("/users/:id", (req, res) => {
  userDao
    .getUserById(req.params.id)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});

app.delete("/users/:id", (req, res) => {
  userDao
    .deleteUser(req.params.id)
    .then((resp) => {
      res.status(204).json(resp);
    })
    .catch((err) => res.status(500).json(err));
});

app.get("/pages", (req, res) => {
  pageDao
    .getAllPages()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.get("/pages/:id", (req, res) => {
  pageDao
    .getPage(req.params.id)
    .then((resp) => {
      return res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.put(
  "/pages/:id",
  [
    check("title").isLength({ min: 1, max: 50 }).withMessage("invalid title"),
    check("publication_date")
      .optional()
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("invalid publication_date"),
    check("blocks")
      .isArray()
      .notEmpty()
      .custom((value) => {
        const containsHeader = value.some((obj) => obj.blockType === "h");
        if (!containsHeader) {
          throw new Error("Almost one header is required!");
        }
        return true;
      }),
  ],
  (req, res) => {
    const page = {
      id: req.params.id,
      title: req.body.title,
      publication_date: req.body.publication_date,
      blocks: req.body.blocks,
    };
    pageDao
      .modifyPage(page)
      .then((resp) => {
        return res.json(resp);
      })
      .catch((err) => res.status(500).json(err));
  }
);
app.delete("/pages/:id", (req, res) => {
  pageDao
    .deletePage(req.params.id)
    .then((resp) => {
      res.status(204).json(resp);
    })
    .catch((err) => res.status(500).json(err));
});

app.delete("/blocks/:id", (req, res) => {
  blocksDao
    .deleteBlock(req.params.id)
    .then((resp) => {
      res.status(204).json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.post(
  "/pages",
  [
    check("title").isLength({ min: 1, max: 50 }).withMessage("invalid title"),
    check("author").isLength({ min: 1, max: 50 }).withMessage("invalid author"),
    check("publication_date")
      .optional()
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("invalid publication_date"),
    check("blocks")
      .isArray()
      .notEmpty()
      .custom((value) => {
        const containsHeader = value.some((obj) => obj.blockType === "h");
        if (!containsHeader) {
          throw new Error("Almost one header is required!");
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    console.log(req.body);
    console.log("errors..");
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    //validazione
    console.log(req.body);
    //   if (!req.body.name || !req.body.email) {
    //     return res.status(400).json({ error: "Name and email are required" });
    //   }
    const page = {
      title: req.body.title,
      author: req.body.author,
      publication_date: req.body.publication_date,
      blocks: req.body.blocks,
    };

    pageDao
      .createPage(page)
      .then((resp) => {
        return res.status(201).json(resp);
      })
      .catch((err) => res.status(500).json(err));
  }
);

//Authentication API
app.post("/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser() in LocalStratecy Verify Fn
      return res.json(req.user);
    });
  })(req, res, next);
});

app.post("/signup", async function (req, res, next) {
  try {
    const newUser = await userDao.createUser({
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isAdmin: `${req.body.isAdmin}`,
    })
    if (newUser) {
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ error: info });
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err) return next(err);

          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser() in LocalStratecy Verify Fn
          return res.json(req.user);
        });
      })(req, res, next);
    }
  } catch (err) {
    return res.status(err.status).json(err)
  }
});


// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server Express in esecuzione sulla porta ${port}`);
});
