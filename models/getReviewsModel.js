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

  const categoryValues = [];

  const sortValues = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  const promiseArray = [];

  const orderValues = ["ASC", "DESC", "asc", "desc"];
  if (category) {
    queryStr += ` WHERE category = $1`;
    categoryValues.push(category);

    promiseArray.push(
      db.query(
        `SELECT * FROM categories
    WHERE slug = $1;`,
        [category]
      )
    );
  }

  if (!sortValues.includes(sort_by) || !orderValues.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query!" });
  } else {
    queryStr += ` GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order}`;
  }

  queryStr += `;`;

  promiseArray.push(db.query(queryStr, categoryValues));

  return Promise.all(promiseArray).then((res) => {
    if (res[1] === undefined) {
      return res[0].rows;
    } else if (res[0].rows.length === 0) {
      return Promise.reject({ status: 400, msg: "no such category!" });
    } else {
      return res[1].rows;
    }
  });
};
