const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const User = require('../../models/user').User;
const Game = require('../../models/game').Game;
const Piece = require('../../models/piece').Piece;
const errors = require('../../errors');
const passport = require('../../auth');

exports.createGame = function (req, res, next) {
    const response = {};

    Game.createGameForUser(req.user._id, req.body.color)
    .then(result => {
        response.game = result[0];
        response.token = result[1];

        return Piece.basePieceInit(result[0]);
    })
    .then(() => {
        res.JSON(response);
    })
    .catch(next);
};