const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  removeBook: async (_, { bookID }, { mongo: { Users, Books }, req: { cookies } }) => {
    /**
      Removes book from database

      @param {object} _ unused
      @param {string} bookID ID of book being removed
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
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
    const { owner } = await Books.findOne({ _id: ObjectID(bookID) }).catch(err => { throw err; });
    if (!owner.equals(userId)) return { status: 'must own book to remove' };
    Users.findOneAndUpdate({ _id: ObjectID(userId) }, { $pull: { books: ObjectID(bookID) } }).catch(err => { throw err; });
    Books.remove({ _id: ObjectID(bookID) }, { single: true }).catch(err => { throw err; });
    return { status: true };
  }
};
