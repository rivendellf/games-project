const db = require("../db/connection");

exports.fetchCommentsByReviewId = (review_id, sort_by = "created_at") => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE review_id = $1
        ORDER BY ${sort_by} ASC`,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review ID not found!",
        });
      }
      return res.rows;
    });
};
