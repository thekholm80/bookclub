const { login } = require('./queries/login');
const { getUserInfo } = require('./queries/getUserInfo');

const { register } = require('./mutations/register');
const { addBook } = require('./mutations/addBook');

module.exports = {
  Query: {
    login,
    getUserInfo
  },
  Mutation: {
    register,
    addBook
  }
};
