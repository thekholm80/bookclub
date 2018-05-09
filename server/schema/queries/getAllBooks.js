const { ObjectID } = require('mongodb');

module.exports = {
  getAllBooks: async (_, __, { mongo: { Users, Books } }) => {
    /**
      Queries db for all books

      @param {object} _ unused
      @param {object} __ unused
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @returns {array} all books in db
    */

    const bookList = await Books.find({}).toArray();
    const bookListWithUsers = await Promise.all(bookList.map(async ({ _id, title, author, owner }) => {
      const user = await Users.findOne({ _id: ObjectID(owner) });
      return { _id, title, author, owner: user };
    }));
    return bookListWithUsers;
  }
};
