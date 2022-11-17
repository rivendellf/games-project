const { updateVotesByReviewId } = require("../models/patchByReviewIdModel");

exports.patchVotesByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const votes = req.body.inc_votes;
  updateVotesByReviewId(review_id, votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
