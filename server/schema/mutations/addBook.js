const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  addBook: async (_, { title, author }, { mongo: { Users, Books }, req: { cookies } }) => {
    /**
      Inserts new book into database, updates user's book list
        * Verify jwt
        * Insert book into Books
        * Push book id into user.books

      @param {object} _ unused
      @param {string} title title of book
      @param {string} author author of book
      @param {string} displayName displayName of book owner
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @param {object} cookies cookies parsed from express request object
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
    const result = await Books.insertOne({ title, author, owner: ObjectID(userId) }).catch(error => { throw error; });
    Users.findOneAndUpdate(
      { _id: ObjectID(userId) },
      { $push: { books: result.insertedId } }
    ).catch(error => { throw error; });
    return { status: true };
  }
};
