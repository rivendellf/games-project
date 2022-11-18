const { selectAllReviews } = require("../models/getReviewsModel");

exports.getAllReviews = (req, res, next) => {
  const { sort_by, category, order } = req.query;
  selectAllReviews(sort_by, category, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
