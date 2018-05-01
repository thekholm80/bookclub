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
    status: String!
  }

  type Book {
    title: String!
    author: String!
    owner: User
  }

  type Query {
    login(displayName: String!, password: String!): Status
    getUserInfo(displayName: String!): User
    getAllBooks: [Book]
    getBooksByOwner(displayName: String!): [Book]
  }

  type Mutation {
    register(displayName: String!, password: String!): Status
    addBook(title: String!, author: String!): Status
    requestTrade(bookID: String!): Status
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
