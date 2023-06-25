"use strict";

const PORT = 3000;
const express = require("express");
const userDao = require("./dao-users");
const pageDao = require("./dao-pages");
const blocksDao = require("./dao-blocks");
const settingsDao = require("./dao-settings");
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
  // this user is id + username + name + isAdmin
  console.log(user);
  callback(null, {
    id: user.id,
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin,
  });
});

passport.deserializeUser(function (user, callback) {
  // this user is id + email + name
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5174",
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

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});
// Esempio di route che esegue una query sul database
app.get("/api/users", (req, res) => {
  userDao
    .getAllUsers()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.post(
  "/api/users",
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
    console.log("printing req...");
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
app.get("/api/users/:id", (req, res) => {
  userDao
    .getUserById(req.params.id)
    .then((resp) => {
      if(resp){
        res.json(resp);
      }else{
        res.status(404).json({ error: "User not found" });
      }
      
    })
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/users/:id", (req, res) => {
  userDao
    .deleteUser(req.params.id)
    .then((resp) => {
      if(resp){
        res.status(204).json(resp);
      }else{
        res.status(404).json({error: "Block not found"})
      }
      
    })
    .catch((err) => res.status(500).json(err));
});

app.get("/api/pages", (req, res) => {
  var session = undefined;
  if (req.isAuthenticated()) {
    console.log("The user is authenticated");
    session = req.user;
  }
  pageDao
    .getAllPages(session)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.get("/api/pages/:id", (req, res) => {
  pageDao
    .getPage(req.params.id)
    .then((resp) => {
      return res.json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.put(
  "/api/pages/:id",
  [
    check("title")
      .isLength({ min: 1, max: 50 })
      .withMessage("Invalid title, the title must be at most 50 characters"),
    check("publication_date")
      .optional({ values: "falsy" })
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Invalid publication date"),
    check("blocks")
      .isArray({ min: 2 }) // The array must have at least one element
      .custom((value) => {
        const hasValidContent = value.some(
          (block) => ((block.blockType === 'p' || block.blockType === 'img') && block.content !== '')
        );
        const hasValidHeader = value.some(
          (block) => block.blockType === 'h' && block.content !== ''
        );
  
        if (!hasValidHeader) {
          return false;
        }
  
        if (!hasValidContent) {
         return false;
        }
        // Check that all objects with blockType 'h' have a non-empty content
        const headerErrors = value
          .filter((block) => block.blockType === 'h')
          .map((block) => {
            if (block.content === '') {
              return `The content of the object with blockType "h" cannot be empty`
            }
            return null; // No error
          })
          .filter((error) => error !== null); // Filter out non-null errors
  
        if (headerErrors.length > 0) {
          return false;
        }
  
        // Find all objects with blockType 'p' or 'img' and validate that they have a valid content
        const contentErrors = value
          .filter(
            (block) => block.blockType === 'p' || block.blockType === 'img'
          )
          .map((block) => {
            if (block.content === '') {
              return `The content of the object with blockType "${block.blockType}" cannot be empty`;
            }
            return null; // No error
          })
          .filter((error) => error !== null); // Filter out non-null errors
  
        if (contentErrors.length > 0) {
          return false;
        }
  
        return true; // Validation passed
      })
      .withMessage(
        "The page must contains at least one header, one image and one paragraph with some content"
      ),
  ],
  (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors }); // error message is a single string with all error joined together
    }
    const page = {
      id: req.params.id,
      title: req.body.title,
      publication_date: req.body.publication_date,
      blocks: req.body.blocks,
      author: req.body.author,
    };
    pageDao
      .modifyPage(page)
      .then((resp) => {
        return res.json(resp);
      })
      .catch((err) => res.status(500).json(err));
  }
);
app.delete("/api/pages/:id", (req, res) => {
  pageDao
    .deletePage(req.params.id)
    .then((resp) => {
      res.status(204).json(resp);
    })
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/blocks/:id", (req, res) => {
  blocksDao
    .deleteBlock(req.params.id)
    .then((resp) => {
      res.status(204).json(resp);
    })
    .catch((err) => res.status(500).json(err));
});
app.post(
  "/api/pages",
  [
    check("title")
      .isLength({ min: 1, max: 50 })
      .withMessage("Invalid title, the title must be at most 50 characters"),
    check("author")
      .isLength({ min: 1, max: 50 })
      .withMessage("Invalid author, the author must be at most 50 characters"),
    check("publication_date")
      .optional({ values: "falsy" })
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Invalid Publication date"),
      check("blocks")
      .isArray({ min: 2 }) // The array must have at least one element
      .custom((value) => {
        const hasValidContent = value.some(
          (block) => ((block.blockType === 'p' || block.blockType === 'img') && block.content !== '')
        );
        const hasValidHeader = value.some(
          (block) => block.blockType === 'h' && block.content !== ''
        );
  
        if (!hasValidHeader) {
          return false;
        }
  
        if (!hasValidContent) {
         return false;
        }
        // Check that all objects with blockType 'h' have a non-empty content
        const headerErrors = value
          .filter((block) => block.blockType === 'h')
          .map((block) => {
            if (block.content === '') {
              return `The content of the object with blockType "h" cannot be empty`
            }
            return null; // No error
          })
          .filter((error) => error !== null); // Filter out non-null errors
  
        if (headerErrors.length > 0) {
          return false;
        }
  
        // Find all objects with blockType 'p' or 'img' and validate that they have a valid content
        const contentErrors = value
          .filter(
            (block) => block.blockType === 'p' || block.blockType === 'img'
          )
          .map((block) => {
            if (block.content === '') {
              return `The content of the object with blockType "${block.blockType}" cannot be empty`;
            }
            return null; // No error
          })
          .filter((error) => error !== null); // Filter out non-null errors
  
        if (contentErrors.length > 0) {
          return false;
        }
  
        return true; // Validation passed
      })
      .withMessage(
        "The page must contains at least one header, one image and one paragraph with some content"
      ),
  ],
  (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors }); // error message is a single string with all error joined together
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
app.post("/api/sessions", function (req, res, next) {
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

app.post("/api/signup", async function (req, res, next) {
  try {
    const newUser = await userDao.createUser({
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isAdmin: `${req.body.isAdmin}`,
    });
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
    return res.status(err.status).json(err);
  }
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

app.get("/api/settings", (req, res) => {
  settingsDao
    .getSettings()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => console.log(err));
});

app.put("/api/settings/:id", (req, res) => {
  console.log(req.body);
  settingsDao
    .updateSettings(req.body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => console.log(err));
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
