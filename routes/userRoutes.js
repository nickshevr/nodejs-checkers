'use strict';
const userRoutes = require('./user/index');
const passport = require('../auth');
const router = require('./index');

router.post('/signup',
    userRoutes.createUser,
    passport.authenticate('local'),
    userRoutes.responseUser
);

module.exports = router;