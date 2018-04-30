const { login } = require('./queries/login');
const { register } = require('./mutations/register');

module.exports = {
  Query: {
    login
  },
  Mutation: {
    register
  }
};
