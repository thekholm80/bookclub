const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const schema = require('./schema');
const { PORT, JWT_SECRET } = require('./utils/config');
const connectMongo = require('./utils/mongo-connector');

const start = async () => {
  /*
    Wrapping everything in an async function allows use of await
    on async operations

    Remove/resolve everything marked 'dev only' for production
  */

  const app = express();
  const mongo = await connectMongo().catch(err => { throw err; });

  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.text({ type: 'application/graphql' }));

  // dev only
  const corsOptions = {
    origin: 'http://localhost:8080'
  };

  // dev only: remove cors() for production
  // req is exposed and passed into context to parse jwt tokens
  app.use('/api', bodyParser.json(), cors(corsOptions), graphqlExpress(req => ({
    context: { mongo, req },
    schema
  })));

  // dev only: remove
  app.use('/dev/graphiql', graphiqlExpress({
    endpointURL: '/api'
  }));

  // dev only: remove
  app.use('/graphiql', async (req, res) => {
    /*
      this endpoint is for development, allowing jwt to be set with
      dummy user data then the request is forwareded to /dev/graphiql
    */

    // dummy user data
    const user = {
      display_name: 'lumpy',
      first_name: 'lenny',
      last_name: 'guy',
      password: 'thisIsAHashedString'
    };
    // create tokens
    const cookieToken = await jwt.sign(user, JWT_SECRET, { expiresIn: '14d' });
    // create expiration date for cookie (ms * s * m * h * d)
    const expDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 12));
    // set token in cookie, cookie in header
    res.cookie('BookClub', cookieToken, { httpOnly: true, expires: expDate });
    res.redirect('/dev/graphiql');
  });

  // dev only: resolve for production: res.sendFile(path.join(__dirname, 'public', 'index.html'));
  app.get('/', (req, res) => {
    res.send('Coming soon');
  });

  app.listen(PORT, () => console.log(`Server listening on port ${ PORT }`));
};

start();
