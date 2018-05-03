const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils/config');

module.exports = {
  getRequestsByOwner: async (_, __, { mongo: { Users, Books, Trades }, req: { cookies } }) => {
    /**
      Queries db for pending requests made by logged in user

      @param {object} _ unused
      @param {object} __ unused
      @param {object} Users mongodb collection instance
      @param {object} Books mongodb collection instance
      @param {object} Trades mongodb collection instance
      @param {object} cookies cookies parsed from express req object
      @returns {object} pending trades
    */

    if (!cookies.bookclub) return { requestList: [], status: 'no jwt' };
    let userId;
    try {
      const { _id } = jwt.verify(cookies.bookclub, JWT_SECRET);
      userId = _id;
    } catch (e) {
      userId = false;
    }
    if (!userId) return { status: 'invalid jwt' };
    const { requests } = await Users.findOne({ _id: ObjectID(userId) }).catch(err => { throw err; });
    if (!requests.length) return { requestList: [], status: 'none' };
    const requestList = Promise.all(requests.map(async tradeId => {
      const { bookID, status: tradeStatus } = await Trades.findOne({ _id: ObjectID(tradeId) }).catch(err => { throw err; });
      const { title, author, owner } = await Books.findOne({ _id: ObjectID(bookID) }).catch(err => { throw err; });
      const { displayName: ownerName } = await Users.findOne({ _id: ObjectID(owner) }).catch(err => { throw err; });
      return { book: { title, author, owner: { displayName: ownerName } }, tradeStatus };
    }));
    return { requestList, status: true };
  }
};
