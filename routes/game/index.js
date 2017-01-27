const _ = require('lodash');
const crypto = require('crypto');
const User = require('../../models/user').User;
const Game = require('../../models/game').Game;
const Piece = require('../../models/piece').Piece;
const Token = require('../../models/token').Token;
const errors = require('../../errors');

exports.getGames = function (req, res, next) {
    Game.getGamesForUser(req.user)
    .then(gamesArray => {
        res.json(gamesArray);
    })
    .catch(next);
};

exports.createGame = function (req, res, next) {
    const response = {};

    Game.createGameForUser(req.user._id, req.body.color)
    .then(result => {
        response.game = result[0];
        response.token = result[1];

        return Piece.basePieceInit(result[0]);
    })
    .then(() => {
        res.json(response);
    })
    .catch(next);
};

// @ToDo удалять токен после аппрува
exports.joinGame = function (req, res, next) {
    const gameId = req.params.gameId;
    const token = req.body.token;

    Token.find({
        value: token,
        type: Token.statics.INVITE_TYPE,
        gameId
    })
    .limit(1)
    .lean()
    .then(approved => {
        if (!approved[0]) {
            return next(new errors.NotAcceptable('Wrong Token'));
        }

        return Promise.all([Game.findById(gameId), approved[0].remove()]);
    })
    .then(gameToUpdate => {
        gameToUpdate[0].userList.push(req.user._id);

        return gameToUpdate[0].save();
    })
    .then(() => {
        res.JSON(`Added to ${gameId}`)
    })
    .catch(next);
};

exports.movePiece = function (req, res, next) {
    const gameId = req.params.gameId;
    const newCoords = req.body.newCoords;


};