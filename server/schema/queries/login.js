const jwt = require('jsonwebtoken');

const verifyPassword = require('../../utils/verifyPassword');
const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  login: async (_, { displayName, password }, { mongo: { Users }, res }) => {
    /**
      Queries db for user data
        * Verify displayName
        * Verify password
        * Set jwt in express response header

      @param {object} _ unused
      @param {string} displayName username of user logging in
      @param {string} password password of user logging in
      @param {object} Users MongoDB collection instance
      @param {object} res express response object
      @returns {object} success true if login successful
    */

    const { _id, hash } = await Users.findOne({ displayName }).catch(err => { throw err; });
    if (!_id) return { status: false };
    const match = await verifyPassword(password, hash).catch(err => { throw err; });
    if (!match) return { status: false };
    const user = { _id, displayName };
    const cookieToken = await jwt.sign(user, JWT_SECRET, { expiresIn: '14d' });
    const expDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 12));
    res.cookie('bookclub', cookieToken, { httpOnly: true, expires: expDate });
    return { status: true };
  }
};
