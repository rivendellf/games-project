const db = require("../db/connection");

exports.selectAllReviews = (
  sort_by = "created_at",
  category,
  order = "DESC"
) => {
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;
  const queryValues = [];

  if (category !== undefined) {
    queryStr += ` WHERE category = $1`;
    queryValues.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then((res) => {
    return res.rows;
  });
};
