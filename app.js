const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config   = require('config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./auth');
const connect = require('./db/connect');
const sessionStore = new MongoStore({ mongooseConnection: connect, stringify: false });
const isAuth = require('./middleware/isAuth.js');

const userRouter = require('./routes/userRoutes');
const gameRouter = require('./routes/gameRoutes');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json(config.get('bodyParser.json')));
app.use(bodyParser.urlencoded(config.get('bodyParser.urlencoded')));
app.use(session({
  secret: config.get('session').secret,
  cookie: config.get('session').cookie,
  key: config.get('session').key,
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(isAuth);
app.use('/api', userRouter);
app.use('/', gameRouter);
/**
 * Обработка ошибок: 404
 * */
app.use(function (req, res) {
  res.status(404).json({ error: 404, message: 'route not found' });
});

app.use(function(err, req, res, next) {
  const errStatus = err.status ? err.status : err.statusCode;

  const response = {
    statusCode: errStatus,
    name: err.name,
    message: err.message
  };

  if(err.name === 'ValidationError' && err.errors) {
    const fields = {};

    for(let field in err.errors) {
      fields[field] = err.errors[field].message;
    }

    response.fields = fields;
  }

  res.status(err.status || err.statusCode || 500).json(response);
  next();
});

const port = config.get('server').port;
const host = config.get('server').host;

app.listen(port, host, function () {
  console.log(`[Server]: Start server on port: ${port}`);
  console.log(`used db: ${config.get('database').uri}`);
});
module.exports = app;
