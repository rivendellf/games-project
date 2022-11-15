const db = require("../db/connection.js");

exports.selectAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((results) => {
    return results.rows;
  });
};
