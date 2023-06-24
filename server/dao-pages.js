"use strict";

const db = require("./db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const blocksDao = require("./dao-blocks");

exports.getAllPages = (session) => {
  return new Promise((resolve, reject) => {
    //Se la sessione non è valida, l'utente non è loggato. Quindi ritorno un set di pagine solo in stato Published.
    //Se la sessione è valida, ritorno tutte le pagine.
    //Il controllo sul modify e delete va fatto frontend

    //Se la sessione è valida e in oltre l'utente loggato è admin deve poter cancellare e modificare qualsiasi pagina, e inoltre avere la possibilità di cambiare l'autore di una pagina.
    var sql = "";
    
    if (!session) {
      //page with status 'published'
      console.log("not logged user")
      sql =
        "SELECT pages.*, users.username FROM pages JOIN users ON pages.author = users.id WHERE pages.publication_date <= date('now') ORDER BY pages.publication_date;";
    } else {
      console.log("logged user")
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
    // db.setForeignKeyConstraintsEnabled(true)
    db.get("PRAGMA foreign_keys=ON");
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
function checkBlockAlreadyExists(block_id) {
  return new Promise((resolve, reject) => {
    console.log("BLOCK_ID");
    console.log(block_id);
    const sql = "SELECT * FROM blocks WHERE blocks.id=?";

    db.get(sql, [block_id], (err, row) => {
      if (err) {
        console.log("exception caught!!");
        console.log(err);
        reject(err);
      } else {
        console.log("the block is new ? ");
        console.log("retrieved block...");
        console.log(row);
        console.log(row ? false : true);
        resolve(row ? false : true);
      }
    });
  });
}
exports.modifyPage = (page) => {
  return new Promise((resolve, reject) => {
    // db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function (err)
    const id_page = page.id;

    console.log("Updating with uuid: " + id_page);
    console.log("printing payload...");
    console.log(page);

    const now = new Date().toISOString();

    console.log("creationTime: " + now);

    const sql =
      "UPDATE pages SET title = ?, publication_date=? WHERE pages.id=?";
    db.run(sql, [page.title, page.publication_date, page.id], (err) => {
      if (err) {
        reject(err);
      } else {
        // const orderedPageBlocks = page.blocks.sort((a, b) => a.item_order - b.item_order)
        // console.log('====================')
        // console.log('ordered page blocks')
        // console.log(orderedPageBlocks)
        page.blocks.forEach(async (block) => {
          /*create pageblocks*/
          //INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)s

          //check component already exists:
          const checkFlag = await checkBlockAlreadyExists(block.id);
          console.log("PRINTING CHECK FLAG");
          console.log(checkFlag);
          if (!checkFlag) {
            const sqlBlocks =
              "UPDATE blocks SET content=?, item_order=? WHERE blocks.id=?";
            db.run(
              sqlBlocks,
              [block.content, block.item_order, block.id],
              (err, row) => {
                console.log("DOING UPDATE ON ALREADY EXISTING ITEM");
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
                  console.log("Block " + r.id + " deleted successfully");
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
