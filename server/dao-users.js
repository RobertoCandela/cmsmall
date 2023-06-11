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
//This function is used at log-in time to verify username and password.
exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE users.username=?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, username: row.email, name: row.name };

        console.log(row.salt)
        // Check the hashes wit an async call, this operation may be CPU-intensive (and we don't want to block the server)
        crypto.scrypt(row.password, row.salt, 32, function (err, hashedPassword) {

          
          // WARN: it is 64 and not 32 (as in the week example) in the DB
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            // WARN: it is hash and not password (as in the week example) in the DB
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
        console.log(row)
        resolve(row);
      }
    });
  });
};

//verifica che l'utente sia univoco per username e email
// checkUniqueUser = (user) =>{
//   return new Promise((resolve,reject) => {

//     const sql = "SELECT * FROM users WHERE users.email = ? and users.username = ?";
//     db.get(sql,[user.email,user.username], (err,row)=>{
//       if(err){
//         reject(err)
//       }else {
//         resolve(row)
//       }
//     })
//   })
// }

//ritorna true o false in base al fatto se l'utente esiste oppure no
checkUserExistence = (user) =>{

}

exports.createUser = (user) => {
  return new Promise((resolve, reject) => {
    // db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function (err)
    const id_user = uuidv4();

    console.log("Creating new user with uuid: " + id_user);


    //check if username and email is valid


    console.log("printing payload...")
    console.log(user)

    const salt = crypto.randomBytes(16).toString('hex')

    const hasher = crypto.createHash('sha256');

    hasher.update(user.password + salt);

    const hashedPassword = hasher.digest('hex');

    console.log("hashedPassword: "+hashedPassword)

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
        hashedPassword,
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
  });
};

exports.deleteUser = (user_id) => {

  return new Promise((resolve,reject)=>{
    const sql = "DELETE FROM users WHERE users.id = ?";
    db.run(sql,[user_id],(err)=>{
      if(err){
        reject(err)
      }else{
        resolve(user_id)
      }
    })
  })

}
