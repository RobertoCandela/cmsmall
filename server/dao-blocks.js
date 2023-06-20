"use strict";

const db = require("./db");
const { v4: uuidv4 } = require("uuid");

exports.getAllBlocks = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM blocks";
    db.all(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

exports.deleteBlock = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM blocks WHERE blocks.id=?";
    db.run(sql, [id],(err, row) => {
      if (err) {
        console.log("err!");
        console.log(err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
