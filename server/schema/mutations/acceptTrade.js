const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  acceptTrade: async (_, { tradeId }, { mongo: { Users, Books, Trades }, req: { cookies } }) => {
    /**
      Updates db to accept trade, changes ownership of book
        * Verify jwt
        * Verify trade pending status
        * Update db.book.owner to db.trades.requestedBy
        * Push bookId to requestedBy's db.user.books
        * Pull bookId from user's db.user.books
        * Remove trade from user's pending trades
        * Update trade status to complete

      @param {object} _ unused
      @param {string} tradeId ID of trade being accepted
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @param {object} Trades mongodb collection instance
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
    const { bookID, requestedBy } = await Trades.findOne({ _id: ObjectID(tradeId), status: 'pending', owner: ObjectID(userId) }).catch(err => { throw err; });
    if (!bookID) return { status: 'invalid trade' };
    Books.findOneAndUpdate(
      { _id: ObjectID(bookID) },
      { $set: { owner: ObjectID(requestedBy) } }
    ).catch(err => { throw err; });
    Users.findOneAndUpdate(
      { _id: ObjectID(requestedBy) },
      { $push: { books: ObjectID(bookID) } }
    ).catch(err => { throw err; });
    Users.findOneAndUpdate(
      { _id: ObjectID(userId) },
      { $pull: { pendingTrades: ObjectID(tradeId), books: ObjectID(bookID) } }
    ).catch(err => { throw err; });
    Trades.findOneAndUpdate(
      { _id: ObjectID(tradeId) },
      { $set: { status: 'complete' } }
    ).catch(err => { throw err; });
    return { status: true };
  }
};
