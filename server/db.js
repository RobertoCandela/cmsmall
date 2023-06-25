"use strict";
/** DB access module **/

const sqlite = require("sqlite3");

const db = new sqlite.Database("./database/CMSmall.db", (err) => {
  if (err) throw err;
  console.log("Connected to CMSMall.db");
});

module.exports = db;
