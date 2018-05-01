
const hashPassword = require('../../utils/hashPassword');

module.exports = {
  register: async (_, { displayName, password }, { mongo: { Users } }) => {
    /**
      Checks database for existing username, if not found inserts new user & hashed password

      @param {object} _ unused
      @param {string} displayName Username requested by new user
      @param {string} password Password requested by new user
      @param {object} Users MongoDB collection instance
      @returns {object} status true if new user created
    */

    const existing = await Users.findOne({ displayName });
    if (!existing) {
      const hash = await hashPassword(password);
      Users.insertOne({
        displayName,
        hash,
        books: [],
        pendingTrades: []
      });
      return { status: true };
    }
    return { status: false };
  }
};
