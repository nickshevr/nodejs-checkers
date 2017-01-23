const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const User = require('../../models/user').User;

exports.createUser = function (req, res, next) {
    req.body.login = req.body.name;

    User.find({ name: req.body.name })
        .limit(1)
        .lean()
        .then(alreadyInSystem => {
            if (alreadyInSystem[0]) {
                return next('err');
            }

            return User.create({
                name: req.body.name,
                password: req.body.password
            });
        })
        .then((user) => {
            return next();
        })
        .catch(next);
};

exports.responseUser = function (req, res, next) {
    User.findById(req.user._id)
    .then(user => {
        res.json(user.toJSON());
    })
    .catch(next);
};