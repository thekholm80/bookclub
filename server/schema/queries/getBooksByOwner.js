const { ObjectID } = require('mongodb');

module.exports = {
  getBooksByOwner: async (_, { displayName }, { mongo: { Users, Books } }) => {
    /**
      Queries db for all books owned by displayName

      @param {object} _ unused
      @param {string} displayName displayName of book owner
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @returns {array} array of books
    */

    const { _id } = await Users.findOne({ displayName }).catch(err => { throw err; });
    const bookList = await Books.find({
      owner: ObjectID(_id)
    }).toArray().catch(err => { throw err; });
    return bookList;
  }
};
