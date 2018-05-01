const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

/*
  TODO:

  Disallow trade requests from/to same id
*/

module.exports = {
  requestTrade: async (_, { bookID }, { mongo: { Users, Books, Trades }, req: { cookies } }) => {
    /*
      Logs a trade request into the db by:
        * Creating a new document in Trades
        * Adding new trade id to requestor's User.pendingRequests
        * Adding new trade id to owner's User.pendingTrades

      :_: unused
      :bookID: <str> id of book requested
      :Users: <obj> mongodb collection instance
      :Books: <obj> mongodb collection instance
      :Trades: <obj> mongodb collection instance
      :cookies: <obj> cookies parsed out of express req object
    */

    // validate jwt token
    if (!cookies.bookclub) return { success: false };
    return jwt.verify(cookies.bookclub, JWT_SECRET, async (error, { _id: userId }) => {
      if (error) return { success: false };
      // find the book
      const { owner } = await Books.findOne({
        _id: ObjectID(bookID)
      }).catch(err => { throw err; });
      // create a new doc in Trades
      const newTrade = await Trades.insertOne({
        bookID,
        owner,
        requestedBy: userId,
        status: 'pending'
      }).catch(err => { throw err; });
      // push trade id to owner's pending trades
      Users.findOneAndUpdate(
        { _id: ObjectID(owner) },
        { $push: { pendingTrades: newTrade.insertedId } }
      ).catch(err => { throw err; });
      // push trade id to requestor's pending requests
      Users.findOneAndUpdate(
        { _id: ObjectID(userId) },
        { $push: { pendingRequests: newTrade.insertedId } }
      ).catch(err => { throw err; });
      return { success: true };
    });
  }
};
