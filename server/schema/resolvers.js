const { login } = require('./queries/login');
const { getUserInfo } = require('./queries/getUserInfo');
const { getAllBooks } = require('./queries/getAllBooks');
const { getBooksByOwner } = require('./queries/getBooksByOwner');
const { getPendingTradesByOwner } = require('./queries/getPendingTradesByOwner');
const { getRequestsByOwner } = require('./queries/getRequestsByOwner');

const { register } = require('./mutations/register');
const { addBook } = require('./mutations/addBook');
const { requestTrade } = require('./mutations/requestTrade');
const { removeBook } = require('./mutations/removeBook');
const { rejectTrade } = require('./mutations/rejectTrade');

module.exports = {
  Query: {
    login,
    getUserInfo,
    getAllBooks,
    getBooksByOwner,
    getPendingTradesByOwner,
    getRequestsByOwner
  },
  Mutation: {
    register,
    addBook,
    requestTrade,
    removeBook,
    rejectTrade
  }
};
