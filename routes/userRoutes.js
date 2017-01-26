'use strict';
const userRoutes = require('./user/index');
const passport = require('../auth');
const router = require('./index');

router.post('/signup',
    userRoutes.createUser,
    passport.authenticate('local'),
    userRoutes.responseUser
);

router.post('/login',
    userRoutes.login,
    userRoutes.responseUser
);

router.get('/logout',
    userRoutes.logout
);

module.exports = router;