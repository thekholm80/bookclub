const jwt = require('jsonwebtoken');

const verifyPassword = require('../../utils/verifyPassword');
const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  login: async (_, { displayName, password }, { mongo: { Users }, res }) => {
    /*
      This query will request user info from the database (login action) and
      if successful set a jwt cookie in response header

      :_: <obj> unused
      :displayName: <str> username of user logging in
      :password: <str> passwrod of user logging in
      :Users: <obj> MongoDB collection instance
      :res: <obj> express response object
      :returns: <obj> success: true if login successful
    */

    const { _id, hash } = await Users.findOne({ displayName }).catch(err => { throw err; });
    if (_id) {
      const match = await verifyPassword(password, hash).catch(err => { throw err; });
      if (match) {
        const user = {
          _id,
          displayName
        };
        const cookieToken = await jwt.sign(user, JWT_SECRET, { expiresIn: '14d' });
        const expDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 12));
        res.cookie('bookclub', cookieToken, { httpOnly: true, expires: expDate });
        return { success: true };
      }
    }
    return { success: false };
  }
};
