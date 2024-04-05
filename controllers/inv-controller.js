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

/* ***************************
 *  Editing vehicle
 * ************************** */
invCont.editVehicle = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Updating a vehicle in the database
 * ************************** */
invCont.updateVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    inv_id,
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

  const updateResult = await invModel.updateVehicle(
    inv_id,
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

  if (updateResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} has been succesfully updated.`
    );
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    req.flash("notice", "Sorry, there was an issue.");
    res.status(501).render("./inventory/edit-vehicle", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classList: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Deleting vehicle
 * ************************** */
invCont.deleteConfirmation = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-vehicle", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Updating a vehicle in the database
 * ************************** */
invCont.deleteVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;

  const deleteResult = await invModel.deleteVehicle(inv_id);

  if (deleteResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} has been succesfully deleted.`
    );
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, there was an issue.");
    res.status(501).render("./inventory/delete-vehicle", {
      title: `Delete ${inv_make} ${inv_model}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

invCont.getInventoryPendingApproval = async function (req, res) {
  let nav = await utilities.getNav();

  const classification_results =
    await invModel.getClassificationsPendingApproval();
  const classification_list = classification_results.rows;
  const vehicle_results = await invModel.getInventoryPendingApproval();
  const vehicle_list = vehicle_results.rows;

  let classification_approvals;
  let vehicle_approvals;

  if (classification_list.length != 0) {
    classification_approvals = `<div class="approval-list">`;
    classification_list.forEach((classification) => {
      classification_approvals += `<form action="/inv/approve-class" method="post">`;
      classification_approvals += `<h3>${classification.classification_name}</h3>`;
      classification_approvals += `<input type="submit" class="submit-button" value="Approve"/>`;
      classification_approvals += "</form>";
    });
    classification_approvals += `</div>`;
  }

  if (vehicle_list.length != 0) {
    vehicle_approvals = `<div class="approval-list">`;
    vehicle_list.forEach((vehicle) => {
      vehicle_approvals += `<form action="/inv/approve-class" method="post">`;
      vehicle_approvals += `<h3>${vehicle.inv_make} ${vehicle.inv_model}</h3>`;
      vehicle_approvals += `<input type="submit" class="submit-button" value="Approve"/>`;
      vehicle_approvals += "</form>";
    });
    vehicle_approvals += `</div>`;
  }

  res.render("./inventory/inventory-approval", {
    title: "Inventory Pending Approval",
    nav,
    classification_approvals,
    vehicle_approvals,
  });
};

module.exports = invCont;
