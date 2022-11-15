const { selectAllCategories } = require("../models/categoriesModel");

exports.getAllCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      console.log("in the controller");
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};
