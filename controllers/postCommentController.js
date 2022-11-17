const { insertCommentByReviewId } = require("../models/postCommentModel");

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  insertCommentByReviewId(req.body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
