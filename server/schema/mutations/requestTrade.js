const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  requestTrade: async (_, { bookID }, { mongo: { Users, Books, Trades }, req: { cookies } }) => {
    /**
      Logs a trade request into the db:
        * Verify jwt
        * Verify user has not previously requested this book
        * Creating a new document in Trades
        * Adding new trade id to requestor's User.requests
        * Adding new trade id to owner's User.pendingTrades

      @param {object} _ unused
      @param {string} bookID id of book requested
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @param {object} Trades mongodb collection instance
      @param {object} cookies cookies parsed out of express req object
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
    if (owner.equals(userId)) return { status: 'cannot trade own book' };
    const checkForExisting = await Trades.find({ bookID: ObjectID(bookID), requestedBy: ObjectID(userId), status: 'pending' }).toArray().catch(err => { throw err; });
    if (checkForExisting.length) return { status: 'previous request pending' };
    const newTrade = await Trades.insertOne({
      bookID: ObjectID(bookID),
      owner: ObjectID(owner),
      requestedBy: ObjectID(userId),
      status: 'pending'
    }).catch(err => { throw err; });
    Users.findOneAndUpdate(
      { _id: ObjectID(owner) },
      { $push: { pendingTrades: newTrade.insertedId } }
    ).catch(err => { throw err; });
    Users.findOneAndUpdate(
      { _id: ObjectID(userId) },
      { $push: { requests: newTrade.insertedId } }
    ).catch(err => { throw err; });
    return { status: true };
  }
};
