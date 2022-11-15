const express = require("express");
const { getAllCategories } = require("./controllers/categoriesController");
const app = express();

app.get("/api/categories", getAllCategories);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found!" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error!" });
});

module.exports = app;
