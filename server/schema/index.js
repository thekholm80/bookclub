const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type User {
    displayName: String
    firstName: String
    lastName: String
    city: String
    state: String
    pendingTrades: [String]
    pendingRequests: [String]
  }

  type Status {
    status: String!
  }

  type Book {
    title: String!
    author: String!
    owner: User
  }

  type Trade {
    book: Book!
    requestedBy: String
    tradeStatus: String!
  }

  type PendingTrades {
    tradeList: [Trade]
    status: String!
  }

  type PendingRequests {
    requestList: [Trade]
    status: String!
  }

  type Query {
    login(displayName: String!, password: String!): Status
    getUserInfo(displayName: String!): User
    getAllBooks: [Book]
    getBooksByOwner(displayName: String!): [Book]
    getPendingTradesByOwner: PendingTrades
    getPendingRequestsByOwner: PendingRequests
  }

  type Mutation {
    register(displayName: String!, password: String!): Status
    addBook(title: String!, author: String!): Status
    requestTrade(bookID: String!): Status
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
