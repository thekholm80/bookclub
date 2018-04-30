
const hashPassword = require('../../utils/hashPassword');

module.exports = {
  register: async (_, { userName, password }, { mongo: { Users } }) => {
    /*
      Checks database for existing username, if not found inserts new user & hashed password

      :_: <obj> unused
      :userName: <str> Username requested by new user
      :password: <str> Password requested by new user
      :Users: <obj> MongoDB collection instance
      :returns: <bool> true if new user created
    */

    const existing = await Users.findOne({ userName });

    if (!existing) {
      const hash = await hashPassword(password);
      Users.insertOne({ userName, hash });
      return { success: true };
    }
    return { success: false };
  }
};
