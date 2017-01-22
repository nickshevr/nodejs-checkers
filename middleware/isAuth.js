'use strict';
const errors = require('../errors');
const nonAuthRoutes = [
    'signup',
    'login',
    'logout'
];

module.exports = function(req, res, next) {
    const url = req.url.split('\?')[0];
    const uri = url.split('/')[1];
    if(req.user) {
        return next();
    }

    if (nonAuthRoutes.indexOf(uri.toLowerCase()) !== -1) {
        return next();
    }

    return next(new errors.NotAcceptable('incorrect token'));
};
