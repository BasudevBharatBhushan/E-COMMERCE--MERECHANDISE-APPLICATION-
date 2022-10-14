const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save category in DB",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  //Extracting Category infromation from the parameter extractor /:categoryId
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  //We use exec() to receive a callback
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; //We are able to grab this because of the middleware getCategoryById
  category.name = req.body.name; //It is responsible for grabing the category name which is being sent from our Frontend or Postman

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update this category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to Delete this category",
      });
    }
    res.json({
      message: `$category successfully deleted`,
    });
  });
};
