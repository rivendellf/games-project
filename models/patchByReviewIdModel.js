const db = require("../db/connection");

exports.updateVotesByReviewId = (review_id, votes = 0) => {
  const queryStr = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;

  const queryValues = [votes, review_id];

  return db.query(queryStr, queryValues).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "review ID not found!" });
    }
    return res.rows[0];
  });
};
