const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "path not found!" });
      }
      return res.rows[0];
    });
};
