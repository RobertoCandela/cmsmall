"use strict";

const db = require("./db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const blocksDao = require("./dao-blocks");

exports.getAllPages = (session) => {
  return new Promise((resolve, reject) => {
    var sql = "";

    if (!session) {
      sql =
        "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id WHERE pages.publication_date <= date('now') AND pages.publication_date <> '' ORDER BY pages.publication_date;";
    } else {
      sql =
        "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id ORDER BY pages.publication_date";
    }

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
    const sql =
      "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id WHERE pages.id = ?";
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
    db.get("PRAGMA foreign_keys=ON");
    db.run(sql, [page_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
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
function checkBlockAlreadyExists(block_id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM blocks WHERE blocks.id=?";

    db.get(sql, [block_id], (err, row) => {
      if (err) {
        console.log("exception caught!!");
        console.log(err);
        reject(err);
      } else {
        resolve(row ? false : true);
      }
    });
  });
}
exports.modifyPage = (page) => {
  return new Promise((resolve, reject) => {
    const id_page = page.id;

    const now = new Date().toISOString();

    if (page.author) {
      const sql =
        "UPDATE pages SET title = ?, author=?, publication_date=? WHERE pages.id=?";
      db.run(
        sql,
        [page.title, page.author, page.publication_date, page.id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            page.blocks.forEach(async (block) => {
              const checkFlag = await checkBlockAlreadyExists(block.id);
              if (!checkFlag) {
                const sqlBlocks =
                  "UPDATE blocks SET content=?, item_order=? WHERE blocks.id=?";
                db.run(
                  sqlBlocks,
                  [block.content, block.item_order, block.id],
                  (err, row) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(row);
                    }
                  }
                );
              } else {
                const sqlBlocks =
                  "INSERT INTO blocks (id, blockType, content, page_blocks, item_order) VALUES(?,?,?,?,?)";
                db.run(
                  sqlBlocks,
                  [
                    block.id,
                    block.blockType,
                    block.content,
                    id_page,
                    block.item_order,
                  ],
                  (err, row) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(row);
                    }
                  }
                );
              }
            });

            resolve(this.getPage(id_page));
          }
        }
      );
    } else {
      const sql =
        "UPDATE pages SET title = ?, publication_date=? WHERE pages.id=?";
      db.run(sql, [page.title, page.publication_date, page.id], (err) => {
        if (err) {
          reject(err);
        } else {
          page.blocks.forEach(async (block) => {
            const checkFlag = await checkBlockAlreadyExists(block.id);
            if (!checkFlag) {
              const sqlBlocks =
                "UPDATE blocks SET content=?, item_order=? WHERE blocks.id=?";
              db.run(
                sqlBlocks,
                [block.content, block.item_order, block.id],
                (err, row) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(row);
                  }
                }
              );
            } else {
              const sqlBlocks =
                "INSERT INTO blocks (id, blockType, content, page_blocks, item_order) VALUES(?,?,?,?,?)";
              db.run(
                sqlBlocks,
                [
                  block.id,
                  block.blockType,
                  block.content,
                  id_page,
                  block.item_order,
                ],
                (err, row) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(row);
                  }
                }
              );
            }
          });

          resolve(this.getPage(id_page));
        }
      });
    }

    const currentBlock = page.blocks;

    const sqlGetAvailableBlocks =
      "SELECT * FROM blocks WHERE blocks.page_blocks=?";

    db.all(sqlGetAvailableBlocks, [page.id], (err, row) => {
      if (err) {
        console.log("exception caught!!");
        console.log(err);
      } else {
        row.forEach((r) => {
          if (!currentBlock.find((cb) => cb.id === r.id)) {
            blocksDao
              .deleteBlock(r.id)
              .then((resp) => {
                if (resp) {
                  resolve(resp);
                }
              })
              .catch((err) => console.log(err));
          }
        });
        resolve(row);
      }
    });
  });
};
exports.createPage = (page) => {
  return new Promise((resolve, reject) => {
    const id_page = uuidv4();

    const now = new Date().toISOString();

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
