const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  rejectTrade: async (_, { tradeId }, { mongo: { Users, Trades }, req: { cookies } }) => {
    /**
      Marks trade request sent to user by another as rejected in db
       * Verify jwt
       * Verify user has trade pending
       * Remove trade from user's pending trades
       * Update trade in Trades collection as rejected

      @param {object} _ unused
      @param {string} tradeId ID of trade being rejected
      @param {object} Users mongodb collection instance
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
    const result = await Trades.findOne({ _id: ObjectID(tradeId), status: 'pending', owner: ObjectID(userId) }).catch(err => { throw err; });
    if (!result) return { status: 'invalid request' };
    Users.findOneAndUpdate({ _id: ObjectID(userId) }, { $pull: { pendingTrades: ObjectID(tradeId) } }).catch(err => { throw err; });
    Trades.findOneAndUpdate({ _id: ObjectID(tradeId) }, { $set: { status: 'rejected' } }).catch(err => { throw err; });
    return { status: true };
  }
};
