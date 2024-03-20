const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by listing
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventory_id);
  const listing = await utilities.buildInventoryListing(data);
  let nav = await utilities.getNav();
  const invName = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/listing", {
    title: invName,
    nav,
    listing,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/new-classification", {
    title: "New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build new vehicle view
 * ************************** */
invCont.buildNewVehicle = async function (req, res, next) {
  const classification_id = req.query.classification_id || null;
  const classList = await utilities.buildClassificationList(classification_id);
  let nav = await utilities.getNav();
  res.render("./inventory/new-vehicle", {
    title: "New Vehicle",
    nav,
    errors: null,
    classList,
  });
};

/* ***************************
 *  Adding the new classification to the database
 * ************************** */
invCont.createNewClassification = async function (req, res) {
  const classification_name = req.body.classification_name;

  const invClassResult = await invModel.createNewClassification(
    classification_name
  );
  let nav = await utilities.getNav();
  if (invClassResult) {
    req.flash(
      "notice",
      `${classification_name} classification successfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the new classification couldn't be added.");
    res.status(501).render("./inventory/new-classification", {
      title: "New Classification",
      nav,
    });
  }
};

/* ***************************
 *  Adding the new vehicle to the database
 * ************************** */
invCont.createNewVehicle = async function (req, res) {
  let nav = await utilities.getNav();
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

  const vehicleResult = await invModel.createNewVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    classification_id
  );

  if (vehicleResult) {
    req.flash(
      "notice",
      `The new ${inv_make} ${inv_model} has been succesfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, there was an issue.");
    res.status(501).render("./inventory/new-vehicle", {
      title: "New Vehicle",
      nav,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId);
  console.log(classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;
