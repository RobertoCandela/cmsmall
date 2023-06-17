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

// SELECT pages.id_page, users.username
// FROM pages
// JOIN users ON pages.author_id = users.user_id;
exports.getAllPages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id";
    db.all(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};


exports.getPage = (page_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM pages WHERE pages.id = ?";
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

exports.deletePage = (page_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM pages WHERE pages.id = ?";
    db.run(sql, [page_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        console.log(row)
        resolve(row);
      }
    });
  });
};

exports.getPageAuthor = () =>{
  return new Promise((resolve, reject) => {
    const sql = "SELECT username FROM users,pages WHERE pages.id = users.id AND pages.id = ?";
    db.get(sql, [page_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        console.log(row)
        resolve(row);
      }
    });
  });

}
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
      "INSERT INTO pages (id, title, author, created_at, publication_date) VALUES(?, ?, ?, ?, ?)";
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
