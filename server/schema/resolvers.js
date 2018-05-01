const { login } = require('./queries/login');
const { getUserInfo } = require('./queries/getUserInfo');
const { getAllBooks } = require('./queries/getAllBooks');
const { getBooksByOwner } = require('./queries/getBooksByOwner');

const { register } = require('./mutations/register');
const { addBook } = require('./mutations/addBook');
const { requestTrade } = require('./mutations/requestTrade');

module.exports = {
  Query: {
    login,
    getUserInfo,
    getAllBooks,
    getBooksByOwner
  },
  Mutation: {
    register,
    addBook,
    requestTrade
  }
};
