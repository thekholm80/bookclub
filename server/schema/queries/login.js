const verifyPassword = require('../../utils/verifyPassword');
/*
  TODO:

  generate jwt
  issue jwt (expose res object?)

  Currently returning user object, not sure if this is best
*/

module.exports = {
  login: async (_, { userName, password }, { mongo: { Users } }) => {
    /*
      This query will request user info from the database (login action)

      :_: <obj> unused
      :userName: <str> username of user logging in
      :password: <str> passwrod of user logging in
      :Users: <obj> MongoDB collection instance
      :returns: <obj> object containing user data
    */

    const user = await Users.findOne({ userName }).catch(err => { throw err; });
    const match = await verifyPassword(password, user.hash).catch(err => { throw err; });

    if (match) {
      return { userName: user.userName, success: true };
    } else {
      return { success: false };
    }
  }
};
