const { body, validationResult } = require("express-validator");
const utilities = require(".");
const accept = {};
const invModel = require("../models/inventory-model");

accept.newClassificationRules = () => {
  return body("classification_name")
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Please enter the name of the classification without special characters or spaces.");
};

accept.checkClassificationData = async (req, res, next) => {
  const classification_name = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Did I reach here?");
    let nav = await utilities.getNav();
    res.render("inventory/new-classification", {
      errors,
      title: "New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

accept.newVehicleRules = () => {
  return [];
};

accept.checkVehicleData = async (req, res, next) => {};

module.exports = accept;
