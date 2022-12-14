const db = require("../db/connection");

exports.insertCommentByReviewId = (body, review_id) => {
  const { username, comment } = body;
  const queryValues = [username, comment, review_id];
  const queryStr = `INSERT INTO comments (author, body, review_id)
VALUES ($1, $2, $3) RETURNING *;`;
  return db.query(queryStr, queryValues).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "review ID not found!" });
    }
    return res.rows[0];
  });
};
