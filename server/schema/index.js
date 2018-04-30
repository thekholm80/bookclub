const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type User {
    displayName: String
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
    login(displayName: String!, password: String!): Status
    getUserInfo(displayName: String!): User
  }

  type Mutation {
    register(displayName: String!, password: String!): Status
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
