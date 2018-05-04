const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  cancelRequest: async (_, { tradeId }, { mongo: { Users, Trades }, req: { cookies } }) => {
    /**
      Removes trade request from db
        * Verify jwt
        * Verify valid, pending trade
        * Remove trade record from Trades
        * Pull trade from owner's pending requests
        * Pull trade from user's requests

      @param {object} _ unused
      @param {string} tradeId Id of trade being cancelled
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
      userId = null;
    }
    if (!userId) return { status: 'invalid jwt' };
    const { owner } = await Trades.findOne({ _id: ObjectID(tradeId), status: 'pending', requestedBy: ObjectID(userId) }).catch(err => { throw err; });
    if (!owner) return { status: 'invalid request' };
    Trades.remove({ _id: ObjectID(tradeId) }).catch(err => { throw err; });
    Users.findOneAndUpdate(
      { _id: ObjectID(owner) },
      { $pull: { pendingTrades: ObjectID(tradeId) } }
    ).catch(err => { throw err; });
    Users.findOneAndUpdate(
      { _id: ObjectID(userId) },
      { $pull: { requests: ObjectID(tradeId) } }
    ).catch(err => { throw err; });
    return { status: true };
  }
};
