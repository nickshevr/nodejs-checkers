'use strict';

var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var User = require('../models/user').User;

/**
 * Модуль реализует локальную стратегию регистрации / авторизации (login & password)
 */

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, function(login, password, done) {
    User.find({ username: login }, { limit: 1 }, function(err, user){
        if (err) return done(err);

        if (!user[0]) {
            return done(null, false, {errorType: 1});
        }

        if (!user[0].checkPassword(password)) {
            return done(null, false, { errorType: 2 });
        }

        done(null, user[0]);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    User.findById(id, (err,user) => { err ? done(err): done(null, user) });
});
