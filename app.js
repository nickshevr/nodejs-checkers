const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config   = require('config');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);;
const passport = require('./auth');
const connect = mongoose.connect(config.get('database').uri, config.options);
//const sessionStore = new MongoStore({ mongooseConnection: connect, stringify: false });

const routes = require('./routes/index');
const app = express();

app.use(logger('dev'));
/*app.use(session({
  secret: config.get('session').secret,
  cookie: config.get('session').cookie,
  key: config.get('session').key,
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));*/
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
// catch 404 and forward to error handler

app.use(function(err, req, res, next) {
  const errStatus = err.status ? err.status : err.statusCode;

  const response = {
    statusCode: errStatus,
    name: err.name,
    message: err.message
  };

  res.status(err.status || err.statusCode || 500).json(response);
  next();
});

const port = config.get('server').port;
const host = config.get('server').host;

app.listen(port, host, function () {
  logger(`[Server]: Start server on port: ${port}`);
  logger(`used db: ${config.get('database').uri}`);
});
module.exports = app;
