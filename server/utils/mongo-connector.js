const { MongoClient } = require('mongodb');
const { DB_URL } = require('./config');

module.exports = async () => {
  /*
    Connects to database, returns an object with each collection
  */
  const client = await MongoClient.connect(DB_URL).catch(err => { throw err; });

  return {
    Users: client.db('bookclub').collection('users')
  };
};
