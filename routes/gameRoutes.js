'use strict';
const gameRoutes = require('./game/index');
const router = require('./index');

router.post('/:username/game',
    gameRoutes.createGame
);

router.get('/:username/game',
    gameRoutes.getGames
);

router.post('/:username/game/:gameId/join',
    gameRoutes.joinGame
);

router.get('/:username/game/:gameId/pieces',
    gameRoutes.getPieceInfo
);

module.exports = router;