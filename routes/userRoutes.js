'use strict';
const middleware = require('../middleware');
const userRoutes = require('./users/custom');
const userValidationSchema = require('./users/schemas');
const passport = require('../auth');
const router = require('./router');

router.use('/signup',
    middleware.requestTypeValidator(['POST']),
    middleware.validators.bodyIsValid(userValidationSchema.create),
    userRoutes.createUser,
    userRoutes.sendActivation,
    passport.authenticate('local'),
    middleware.pushToken,
    middleware.getXmppToken,
    userRoutes.responseUser
);

router.use('/login',
    middleware.requestTypeValidator(['POST']),
    middleware.validators.bodyIsValid(userValidationSchema.login),
    userRoutes.login,
    middleware.pushToken,
    userRoutes.responseUser
);

router.use('/logout',
    middleware.requestTypeValidator(['GET']),
    userRoutes.logout
);

router.use('/:username/info',
    middleware.requestTypeValidator(['GET']),
    userRoutes.info
);

router.use('/:username/push',
    middleware.requestTypeValidator(['POST']),
    middleware.pushToken,
    userRoutes.responseUser
);

router.use('/me',
    middleware.requestTypeValidator(['GET', 'PUT', 'PATCH'])
);

router.get('/me',
    function(req, res, next) {
        next()
    },
    userRoutes.me,
    userRoutes.responseUser
);

router.put('/me',
    userRoutes.updateUser,
    userRoutes.responseUser
);

router.patch('/me',
    middleware.addOperationID,
    userRoutes.updateUser,
    userRoutes.responseUser
);

router.post('/activate',
    userRoutes.activateToken,
    userRoutes.responseUser
);

router.get('/:username/getxmpptoken',
    middleware.getXmppToken,
    userRoutes.getXmppToken
);

module.exports = router;