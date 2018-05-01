const { ObjectID } = require('mongodb');

module.exports = {
  getBooksByOwner: async (_, { displayName }, { mongo: { Users, Books } }) => {
    /*
      Queries db for all books owned by displayName

      :_: unused
      :displayName: <str> displayName of book owner
      :Users: <obj> mongodb collection instance
      :Books: <obj> mongodb collection instance
      :returns: <arr> array of books
    */

    const { _id } = await Users.findOne({ displayName }).catch(err => { throw err; });
    const bookList = await Books.find({
      owner: ObjectID(_id)
    }).toArray().catch(err => { throw err; });
    return bookList;
  }
};
