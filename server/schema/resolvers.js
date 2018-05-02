const { login } = require('./queries/login');
const { getUserInfo } = require('./queries/getUserInfo');
const { getAllBooks } = require('./queries/getAllBooks');
const { getBooksByOwner } = require('./queries/getBooksByOwner');
const { getPendingTradesByOwner } = require('./queries/getPendingTradesByOwner');
const { getPendingRequestsByOwner } = require('./queries/getPendingRequestsByOwner');

const { register } = require('./mutations/register');
const { addBook } = require('./mutations/addBook');
const { requestTrade } = require('./mutations/requestTrade');

module.exports = {
  Query: {
    login,
    getUserInfo,
    getAllBooks,
    getBooksByOwner,
    getPendingTradesByOwner,
    getPendingRequestsByOwner
  },
  Mutation: {
    register,
    addBook,
    requestTrade
  }
};
