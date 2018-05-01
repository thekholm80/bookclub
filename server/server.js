const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

// dev only: remove
const cors = require('cors');

const schema = require('./schema');
const { PORT } = require('./utils/config');
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
  app.use('/api', bodyParser.json(), cors(corsOptions), graphqlExpress((req, res) => ({
    context: { mongo, req, res },
    schema
  })));

  // dev only: remove
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/api'
  }));

  // dev only: resolve for production: res.sendFile(path.join(__dirname, 'public', 'index.html'));
  app.get('/', (req, res) => {
    res.send('Coming soon');
  });

  app.listen(PORT, () => console.log(`Server listening on port ${ PORT }`));
};

start();
