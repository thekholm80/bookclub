const { MongoClient } = require('mongodb');
const { DB_URL } = require('./config');

module.exports = async () => {
  /*
    Connects to database, returns an object with each collection
  */
  const client = await MongoClient.connect(DB_URL).catch(err => { throw err; });

  return {
    Users: client.db('bookclub').collection('users'),
    Books: client.db('bookclub').collection('books'),
    Trades: client.db('bookclub').collection('trades')
  };
};

/*
  Collection structure:

  db.users.find().pretty():
  {
    "_id" : ObjectId("..."),
    "displayName" : "...",
    "hash" : "...",
    "firstName" : "...",
    "lastName" : "...",
    "city" : "...",
    "state" : "...",
    "books" : [db.books._id, db.books._id, db.books._id]
  }

  db.books.find().pretty():
  {
    "_id" : ObjectId("..."),
    "title" : "...",
    "author" : "...",
    "owner" : db.users._id
  }

  db.trades.find().pretty():
  {
    "_id" : ObjectId("..."),
    "book" : db.books._id,
    "from" : db.users._id,
    "to" : db.users._id,
    "status" : "(pending||rejected||complete)"
  }
*/
