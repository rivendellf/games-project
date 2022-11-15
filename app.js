const express = require("express");
const { getAllCategories } = require("./controllers/categoriesController");
const { getAllReviews } = require("./controllers/getReviewsController");
const app = express();

app.get("/api/categories", getAllCategories);
app.get("/api/reviews", getAllReviews);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found!" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error!" });
});

module.exports = app;
