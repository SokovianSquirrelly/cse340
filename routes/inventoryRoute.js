// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inv-controller");
const utilities = require("../utilities");
const invAccept = require("../utilities/inventory-acceptance");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build individual vehicle view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.checkIfEmployee,
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/new-classification",
  utilities.checkLogin,
  utilities.checkIfEmployee,
  utilities.handleErrors(invController.buildNewClassification)
);

router.get(
  "/new-vehicle",
  utilities.checkLogin,
  utilities.checkIfEmployee,
  utilities.handleErrors(invController.buildNewVehicle)
);

router.post(
  "/new-classification",
  invAccept.newClassificationRules(),
  invAccept.checkClassificationData,
  utilities.handleErrors(invController.createNewClassification)
);

router.post(
  "/new-vehicle",
  invAccept.newVehicleRules(),
  invAccept.checkVehicleData,
  utilities.handleErrors(invController.createNewVehicle)
);

router.get(
  "/getInventory/:classificationId",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkIfEmployee,
  utilities.handleErrors(invController.editVehicle)
);

router.post(
  "/update/",
  invAccept.newVehicleRules(),
  invAccept.checkUpdateData,
  utilities.handleErrors(invController.updateVehicle)
);

router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkIfEmployee,
  utilities.handleErrors(invController.deleteConfirmation)
);

router.post("/delete", utilities.handleErrors(invController.deleteVehicle));

router.get(
  "/inventory-approval",
  utilities.checkLogin,
  utilities.checkIfAdmin,
  utilities.handleErrors(invController.getInventoryPendingApproval)
);

router.post(
  "/approve-class",
  utilities.handleErrors(invController.approveClassification)
);

router.post(
  "/approve-vehicle",
  utilities.handleErrors(invController.approveVehicle)
);

module.exports = router;
