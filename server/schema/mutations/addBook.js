const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  addBook: async (_, { title, author }, { mongo: { Users, Books }, req: { cookies } }) => {
    /*
      Inserts new book into database, updates user's book list

      :_: unused
      :title: <str> title of book
      :author: <str> author of book
      :displayName: <str> displayName of book owner
      :Users: <obj> mongodb collection instance
      :Books: <obj> mongodb collection instance
      :cookies: <obj> cookies parsed from express request object
      :returns: <obj> success: true if success
    */

    // validate jwt token
    if (!cookies.bookclub) return { success: false };
    return jwt.verify(cookies.bookclub, JWT_SECRET, async (err, { displayName }) => {
      if (err) return { success: false };
      // get owner's _id from Users collection
      const { _id } = await Users.findOne({ displayName }).catch(error => { throw error; });
      // insert new book into db
      const result = await Books.insertOne({
        title,
        author,
        owner: ObjectID(_id)
      }).catch(error => { throw error; });
      // push new book id into users's book list
      Users.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $push: { books: result.insertedId } }
      ).catch(error => { throw error; });
      return { success: true };
    });
  }
};
