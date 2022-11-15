const db = require("../db/connection");
const data = require("../db/data/test-data/index");

exports.selectAllReviews = (sort_by = "created_at") => {
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
    ORDER BY ${sort_by} DESC`;
  return db.query(queryStr).then((res) => {
    return res.rows;
  });
};
