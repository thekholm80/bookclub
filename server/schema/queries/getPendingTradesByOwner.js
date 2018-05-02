const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  getPendingTradesByOwner: async (_, __, { mongo: { Users, Books, Trades }, req: { cookies } }) => {
    /**
      Queries db for pending trade requests for logged in user

      @param {object} _ unused
      @param {object} __ unused
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @param {object} Trades mongodb collection instance
      @param {object} cookies cookies parsed from express req object
      @returns {array} array of pending trades
    */

    if (!cookies.bookclub) return { status: 'no jwt' };
    return jwt.verify(cookies.bookclub, JWT_SECRET, async (error, { _id: userId }) => {
      if (error) return { status: 'invalid jwt' };
      const { pendingTrades } = await Users.findOne({ _id: ObjectID(userId) }).catch(err => { throw err; });
      if (!pendingTrades.length) return { status: 'none' };
      const tradeList = Promise.all(pendingTrades.map(async tradeId => {
        const { bookID, requestedBy: requestedById, status: tradeStatus } = await Trades.findOne({ _id: ObjectID(tradeId) }).catch(err => { throw err; });
        const book = await Books.findOne({ _id: ObjectID(bookID) }).catch(err => { throw err; });
        const { displayName: requestedBy } = await Users.findOne({ _id: ObjectID(requestedById) }).catch(err => { throw err; });
        return { book, requestedBy, tradeStatus };
      }));
      return tradeList;
    });
  }
};
