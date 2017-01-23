const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const User = require('../../models/user').User;

exports.createUser = function (req, res, next) {
    User.create({
        name: req.body.name,
        password: req.body.password
    })
    .then(() => {
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