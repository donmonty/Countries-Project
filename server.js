const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const bodyParser = require('body-parser');

const server = express();

// MIDLEWARES
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(morgan('dev'));


// ROUTER
server.use('/', routes);


// ERRORS
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;