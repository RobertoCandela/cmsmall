"use strict";

const db = require("./db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// exports.getUserById = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM users WHERE id=?";
//     db.get(sql, [id], (err, row) => {
//       if (err) reject(err);
//       else if (row === undefined) resolve({ error: "User not found." });
//       else {
//         // By default, the local strategy looks for "username":
//         // for simplicity, instead of using "email", we create an object with that property.
//         const user = { id: row.id, username: row.email, name: row.name };
//         resolve(user);
//       }
//     });
//   });
// };

exports.getAllPages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM PAGES";
    db.all(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
// This function is used at log-in time to verify username and password.
// exports.getUser = (email, password) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM users";
//     db.get(sql, [email], (err, row) => {
//       if (err) {
//         reject(err);
//       } else if (row === undefined) {
//         resolve(false);
//       } else {
//         const user = { id: row.id, username: row.email, name: row.name };

//         // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
//         crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
//           // WARN: it is 64 and not 32 (as in the week example) in the DB
//           if (err) reject(err);
//           if (
//             !crypto.timingSafeEqual(
//               Buffer.from(row.hash, "hex"),
//               hashedPassword
//             )
//           )
//             // WARN: it is hash and not password (as in the week example) in the DB
//             resolve(false);
//           else resolve(user);
//         });
//       }
//     });
//   });
// };

exports.getPage = (page_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM PAGES WHERE PAGES.UUID_PAGE = ?";
    db.get(sql, [page_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        console.log(row)
        resolve(row);
      }
    });
  });
};

exports.createPage = (page) => {
  return new Promise((resolve, reject) => {
    // db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function (err)
    const id_page = uuidv4();

    console.log("Creating new page with uuid: " + id_page);
    console.log("printing payload...")
    console.log(page)

    const now = new Date().toISOString()

    console.log("creationTime: "+now)

    const sql =
      "INSERT INTO PAGES (UUID_PAGE, TITLE, AUTHOR, CREATED_AT, PUBLICATION_DATE) VALUES(?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        id_page,
        page.title,
        page.author,
        now,
        page.publication_date,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getPage(id_page));
        }
      }
    );
  });
};
