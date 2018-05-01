const bcrypt = require('bcryptjs');

module.exports = async (providedPassword, hashedPassword) => {
  /**
    Compares the password provided by login attemt with the
    hashed password stored in database

    @param {string} providedPassword password provided by user logging in
    @param {string} hashedPassword hashed string stored in database
    @returns {boolean} true if match
  */

  const result = await bcrypt.compare(providedPassword, hashedPassword)
    .catch(err => { throw err; });
  return result;
};
