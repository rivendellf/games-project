const express = require("express");
const { getAllCategories } = require("./controllers/categoriesController");
const app = express();

app.use(express.json());

app.get("/api/categories", getAllCategories);

module.exports = app;
