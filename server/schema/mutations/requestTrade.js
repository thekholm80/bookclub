const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  requestTrade: async (_, { bookID }, { mongo: { Users, Books, Trades }, req: { cookies } }) => {
    /**
      Logs a trade request into the db by:
        * Creating a new document in Trades
        * Adding new trade id to requestor's User.pendingRequests
        * Adding new trade id to owner's User.pendingTrades

      @param {object} _ unused
      @param {string} bookID id of book requested
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @param {object} Trades mongodb collection instance
      @param {object} cookies cookies parsed out of express req object
      @returns {object} status true if success
    */

    // validate jwt token
    if (!cookies.bookclub) return { status: 'no jwt' };
    return jwt.verify(cookies.bookclub, JWT_SECRET, async (error, { _id: userId }) => {
      if (error) return { status: 'invalid jwt' };
      // find the book
      const { owner } = await Books.findOne({
        _id: ObjectID(bookID)
      }).catch(err => { throw err; });
      // ensure owner isn't requesting to trade their own book
      if (owner.equals(userId)) return { status: 'cannot trade own book' };
      // create a new doc in Trades
      const newTrade = await Trades.insertOne({
        bookID: ObjectID(bookID),
        owner: ObjectID(owner),
        requestedBy: ObjectID(userId),
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
      return { status: true };
    });
  }
};
