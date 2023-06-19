"use strict";

const db = require("./db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

exports.getAllPages = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id";
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
  var pages = {};
  return new Promise((resolve, reject) => {
    const sql = "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id WHERE pages.id = ?";
    db.get(sql, [page_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        pages = row;

        const sqlBlock = "SELECT * FROM blocks WHERE blocks.page_blocks = ?";

        db.all(sqlBlock, [page_id], (err, blockRow) => {
          if (err) {
            reject(err);
          } else {
            pages = { ...pages, blocks: blockRow };
            console.log("print partial result");
            console.log(pages);
            resolve(pages);
          }
        });
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
        console.log(row);
        resolve(row);
      }
    });
  });
};

exports.getPageAuthor = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT username FROM users,pages WHERE pages.id = users.id AND pages.id = ?";
    db.get(sql, [page_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        console.log(row);
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
    console.log("printing payload...");
    console.log(page);

    const now = new Date().toISOString();

    console.log("creationTime: " + now);

    const sql =
      "INSERT INTO pages (id, title, author, created_at, publication_date) VALUES(?, ?, ?, ?, ?)";
    db.run(
      sql,
      [id_page, page.title, page.author, now, page.publication_date],
      (err) => {
        if (err) {
          reject(err);
        } else {
          page.blocks.forEach((block, index) => {
            /*create pageblocks*/
            //INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)
            const sqlBlocks =
              "INSERT INTO blocks (id, blockType, content, page_blocks, item_order) VALUES(?,?,?,?,?)";
            db.run(
              sqlBlocks,
              [block.id, block.blockType, block.content, id_page, index],
              (err) => {
                if (err) {
                  reject(err);
                }
              }
            );
          });

          resolve(this.getPage(id_page));
        }
      }
    );
  });
};
