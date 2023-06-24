const db = require("./db");
exports.getSettings = () => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM settings";
      db.all(sql, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row)
        }
      });
    });
  };

  exports.updateSettings = (setting) => {
    return new Promise((resolve, reject) => {
      // db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function (err)
  
      console.log("Update setting id: " + setting.id);
      console.log("Update with value: "+setting.value)
  
      const sql =
        "UPDATE settings SET value = ? WHERE settings.id=?";
      db.run(sql, [setting.value,setting.id], (err,row) => {
        if (err) {
          reject(err);
        } else {
          resolve(setting);
        }
      });
    });
  };