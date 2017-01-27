const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const User = require('../../models/user').User;
const errors = require('../../errors');
const passport = require('../../auth');

exports.createUser = function (req, res, next) {
    req.body.login = req.body.username;

    User.find({ username: req.body.username })
        .limit(1)
        .lean()
        .then(alreadyInSystem => {
            if (alreadyInSystem[0]) {
                return next(new errors.NotAcceptable(`${req.body.username} has been already taken`));
            }

            return User.create({
                username: req.body.username,
                password: req.body.password
            });
        })
        .then(user => {
            if (!user) {
                return next(new errors.ForbiddenError(`User wasn't created`));
            }

            return next();
        })
        .catch(next);
};

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, options) {
        const _options = options || {};

        if (err) return next(err);

        if (!user) {
            if (_options.errorType === 1) {
                return next(new errors.AccessDenied('Wrong username (login)'));
            }

            if (_options.errorType === 2) {
                return next(new errors.AccessDenied('Wrong password'));
            }

            return next(new errors.AccessDenied('You are blocked'));
        }

        req.logIn(user, function (err) {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
};

exports.logout = function(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            next(err);
        } else {
            res.clearCookie(config.get('session.key'));
            res.json({ logout: 'success' });
        }
    });
};

exports.responseUser = function (req, res, next) {
    console.log('***', req.user._id);

    User.findOne({ _id: req.user._id })
    .then(user => {
        res.json(user.toJSON());
    })
    .catch(next);
};