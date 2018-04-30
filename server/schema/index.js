const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type User {
    userName: String
    firstName: String
    lastName: String
    city: String
    state: String
    success: Boolean
  }

  type Status {
    success: Boolean!
  }

  type Query {
    login(userName: String!, password: String!): Status
  }

  type Mutation {
    register(userName: String!, password: String!): Status
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
