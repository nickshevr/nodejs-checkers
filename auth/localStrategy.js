'use strict';

var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var User = require('../models/user').User;

/**
 * Модуль реализует локальную стратегию регистрации / авторизации (login & password)
 *
 * В качестве login может использоваться username or getPassword
 */

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, function(login, password, done) {
    User.find({ username: login }, function(err, user){
        if (err) return done(err);

        if (!user) {
            return done(null, false, {errorType: 1});
        }

        done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    User.findById(id, (err,user) => { err ? done(err): done(null, user) });
});
