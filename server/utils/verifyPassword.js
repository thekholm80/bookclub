const bcrypt = require('bcryptjs');

module.exports = async (providedPassword, hashedPassword) => {
  /*
    Compares the password provided by login attemt with the
    hashed password stored in database

    :providedPassword: <str> password provided by user logging in
    :hashedPassword: <str> hashed string stored in database
    :returns: <bool> true if match
  */

  const result = await bcrypt.compare(providedPassword, hashedPassword).catch(err => { throw err; });
  return result;
};
