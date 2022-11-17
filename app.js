const express = require("express");
const { getAllCategories } = require("./controllers/categoriesController");
const {
  getCommentsByReviewId,
} = require("./controllers/getCommentsByReviewIdController");
const { getReviewById } = require("./controllers/getReviewByIdController");
const { getAllReviews } = require("./controllers/getReviewsController");
const {
  patchVotesByReviewId,
} = require("./controllers/patchByReviewIdController");
const {
  postCommentByReviewId,
} = require("./controllers/postCommentController");
const app = express();

app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchVotesByReviewId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(400).send({ msg: "bad request!" });
  }
  next(err);
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found!" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error!" });
});

module.exports = app;
