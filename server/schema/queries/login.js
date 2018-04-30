const jwt = require('jsonwebtoken');

const verifyPassword = require('../../utils/verifyPassword');
const { JWT_SECRET } = require('../../utils/config');
/*
  TODO:

  Currently returning user object, not sure if this is best
*/

module.exports = {
  login: async (_, { userName, password }, { mongo: { Users }, res }) => {
    /*
      This query will request user info from the database (login action) and
      if successful set a jwt cookie in response header

      :_: <obj> unused
      :userName: <str> username of user logging in
      :password: <str> passwrod of user logging in
      :Users: <obj> MongoDB collection instance
      :returns: <obj> object containing user data
    */

    const user = await Users.findOne({ userName }).catch(err => { throw err; });
    const match = await verifyPassword(password, user.hash).catch(err => { throw err; });

    if (match) {
      const cookieToken = await jwt.sign(user, JWT_SECRET, { expiresIn: '14d' });
      const expDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 12));
      res.cookie('bookclub', cookieToken, { httpOnly: true, expires: expDate });
      return { userName: user.userName, success: true };
    }
    return { success: false };
  }
};
