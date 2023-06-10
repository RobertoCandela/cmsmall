"use strict";

const PORT = 3000;
const express = require("express");
const userDao = require("./dao-users");
const pageDao = require("./dao-pages")
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();

app.use(express.json());
app.use(cors());
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

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
    check("name").isLength({ min: 1, max: 50 }).withMessage('invalid name'),
    check("surname").isLength({ min: 1, max: 50 }).withMessage('invalid surname'),
    check("username").isLength({ min: 1, max: 20 }).withMessage('invalid username'),
    check("email").isEmail().withMessage('invalid email'),
    check("password").isStrongPassword().withMessage('password not strong enough'),

  ],
  (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    //validazione
    console.log(req.body);
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
      .catch((err) => res.status(500).json(err));
  }
);
app.get('/users/:id',(req,res)=>{

    userDao
    .getUser(req.params.id)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));

})

app.get("/pages", (req, res) => {
    pageDao
      .getAllPages()
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => res.status(500).json(err));
  });
app.get('/pages/:id',(req,res)=>{

    pageDao
    .getPage(req.params.id)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => res.status(500).json(err));

})
app.post(
    "/pages",
    [
      check("title").isLength({ min: 1, max: 50 }).withMessage('invalid title'),
      check("author").isLength({ min: 1, max: 50 }).withMessage('invalid author'), 
      check("publication_date").optional().isDate({format: 'DD-MM-YYYY'}).withMessage('invalid publication_date')
    ],
    (req, res) => {
      const errors = validationResult(req).formatWith(errorFormatter); // format error message
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
        publication_date: req.body.publication_date
      };
  
      pageDao
        .createPage(page)
        .then((resp) => {
          res.status(201).json(resp);
        })
        .catch((err) => res.status(500).json(err));
    }
  );
const port = 3000;
app.listen(port, () => {
  console.log(`Server Express in esecuzione sulla porta ${port}`);
});
