const { login } = require('./queries/login');
const { getUserInfo } = require('./queries/getUserInfo');
const { getAllBooks } = require('./queries/getAllBooks');

const { register } = require('./mutations/register');
const { addBook } = require('./mutations/addBook');

module.exports = {
  Query: {
    login,
    getUserInfo,
    getAllBooks
  },
  Mutation: {
    register,
    addBook
  }
};
