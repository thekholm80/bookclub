const { ObjectID } = require('mongodb');

module.exports = {
  getAllBooks: async (_, __, { mongo: { Users, Books } }) => {
    /*
      Queries db for all books

      :_: unused
      :__: unused
      :Users: <obj> mongodb collection instance
      :Books: <obj> mongodb collection instance
      :returns: <arr> all books in db
    */

    const bookList = await Books.find({}).toArray();
    const bookListWithUsers = await Promise.all(bookList.map(async ({ title, author, owner }) => {
      const user = await Users.findOne({ _id: ObjectID(owner) });
      return { title, author, owner: user };
    }));
    return bookListWithUsers;
  }
};
