const express = require("express");
const router = new express.Router();
const accController = require("../controllers/acc-controller");
const utilities = require("../utilities");

router.get("/login", utilities.handleErrors(accController.buildLogin));

router.get("/register", utilities.handleErrors(accController.buildRegister));

module.exports = router;
