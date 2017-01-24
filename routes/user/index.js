const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const User = require('../../models/user').User;
const errors = require('../../errors');

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

exports.responseUser = function (req, res, next) {
    User.findOne({ _id: req.user._id })
    .then(user => {
        res.json(user.toJSON());
    })
    .catch(next);
};