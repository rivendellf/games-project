const express = require("express");
const { getAllCategories } = require("./controllers/categoriesController");
const { getReviewById } = require("./controllers/getReviewByIdController");
const { getAllReviews } = require("./controllers/getReviewsController");
const app = express();

app.get("/api/categories", getAllCategories);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);

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
