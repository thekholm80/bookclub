const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  updateUserInfo: async (_, { firstName, lastName, city, state }, { mongo: { Users }, req: { cookies } }) => {
    /**
      Updates user data in db

      @param {object} _ unused
      @param {string} firstName
      @param {string} lastName
      @param {string} city
      @param {string} state
      @param {object} Users mongodb colletion instance
      @param {object} cookies cookies parsed from express req object
      @returns {object} status true if success
     */

    if (!cookies.bookclub) return { status: 'no jwt' };
    let userId;
    try {
      const { _id } = jwt.verify(cookies.bookclub, JWT_SECRET);
      userId = _id;
    } catch (e) {
      userId = false;
    }
    if (!userId) return { status: 'invalid jwt' };
    Users.findOneAndUpdate(
      { _id: ObjectID(userId) },
      {
        $set: {
          firstName,
          lastName,
          city,
          state
        }
      }
    ).catch(err => { throw err; });
    return { status: true };
  }
};
