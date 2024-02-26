const pool = require("../database")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const response = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    console.log("This is the SQL response.", response);
    return response;
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount };
