const express = require("express");
const router = new express.Router();
const accController = require("../controllers/acc-controller");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accController.buildLogin));

router.get("/register", utilities.handleErrors(accController.buildRegister));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accController.buildAccountManagement)
);

router.get(
  "/update/:account_id",
  utilities.handleErrors(accController.buildUpdateView)
);

router.post(
  "/update/account-info",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.updateAccount)
);

router.post(
  "/update/password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.updatePassword)
);

router.get("/logout", utilities.handleErrors(accController.logout));

module.exports = router;
