const express = require("express");
const { getAllCategories } = require("./controllers/getCategoriesController");
const {
  getCommentsByReviewId,
} = require("./controllers/getCommentsByReviewIdController");
const { getReviewById } = require("./controllers/getReviewByIdController");
const { getAllReviews } = require("./controllers/getReviewsController");
const { getAllUsers } = require("./controllers/getUsersController");
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
app.get("/api/users", getAllUsers);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchVotesByReviewId);

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "resource not found!" });
  } else next(err);
});

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
