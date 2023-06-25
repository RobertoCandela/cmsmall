"use strict";

const db = require("./db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users";
    db.all(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE users.username=?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          username: row.username,
          name: row.name,
          isAdmin: row.isAdmin,
        };

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};
exports.getUserById = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE users.id = ?";
    db.get(sql, [user_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        console.log(row);
        resolve(row);
      }
    });
  });
};

const checkUniqueUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM users WHERE users.email = ? or users.username = ?";
    db.get(sql, [user.email, user.username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
};

exports.createUser = (user) => {
  return new Promise((resolve, reject) => {
    const id_user = uuidv4();

    checkUniqueUser(user)
      .then((resp) => {
        if (resp) {
          const salt = crypto.randomBytes(16).toString("hex");

          crypto.scrypt(user.password, salt, 32, (err, derivedKey) => {
            if (err) {
              throw err;
            } else {
              const sql =
                "INSERT INTO users (id, name, surname, username, email, password, salt,isadmin) VALUES(?, ?, ?, ?, ?, ?, ?,?)";
              db.run(
                sql,
                [
                  id_user,
                  user.name,
                  user.surname,
                  user.username,
                  user.email,
                  derivedKey.toString("hex"),
                  salt,
                  user.isAdmin,
                ],
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(this.getUserById(id_user));
                  }
                }
              );
            }
          });
        } else {
          const err = {
            status: 400,
            errorMessage: `User with username: ${user.username} or email ${user.email} already exists`,
          };
          console.log(
            "User with username: " +
              user.username +
              " and email " +
              user.email +
              " already exists"
          );
          reject(err);
        }
      })
      .catch();
  });
};

exports.deleteUser = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM users WHERE users.id = ?";
    db.run(sql, [user_id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user_id);
      }
    });
  });
};
