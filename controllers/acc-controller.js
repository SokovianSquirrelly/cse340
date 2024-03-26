const utilities = require("../utilities");
const accModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver account home
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Build update view
 * ************************************ */
async function buildUpdateView(req, res) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const accountData = await accModel.getAccountById(account_id);
  res.render("account/account-update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const updateResult = await accModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Your account has been successfully updated.");
    res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, there was an issue");
    res.status(501).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_password,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error updating the password.");
    res.status(500).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  const updateResult = await accModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash("notice", "Your account has been successfully updated.");
    res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, there was an issue");
    res.status(501).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  registerAccount,
  accountLogin,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
};
