const bcrypt = require('bcryptjs');

module.exports = async password => {
  /**
    Generates salt, hashes password, returns hash

    @param {string} password string to be hashed
    @returns {string} hashed string
  */

  const salt = await bcrypt.genSalt(10).catch(err => { throw err; });
  const hash = await bcrypt.hash(password, salt).catch(err => { throw err; });

  return hash;
};
