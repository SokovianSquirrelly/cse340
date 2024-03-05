const { body, validationResult } = require("express-validator");
const utilities = require(".");
const accept = {};
const invModel = require("../models/inventory-model");

accept.newClassificationRules = () => {
  return body("classification_name")
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage(
      "Please enter the name of the classification without special characters or spaces."
    );
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
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please specify make of the vehicle."),

    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please specify model of the vehicle."),

    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please specify a valid year."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a description of the vehicle."),

    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a price."),

    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter the mileage."),

    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please specify the color of the vehicle."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Plese provide a filepath for the large image."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a filepath for the thumbnail image."),
  ];
};

accept.checkVehicleData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/new-vehicle", {
      errors,
      title: "New Vehicle",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = accept;
