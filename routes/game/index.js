const _ = require('lodash');
const crypto = require('crypto');
const User = require('../../models/user').User;
const Game = require('../../models/game').Game;
const Piece = require('../../models/piece').Piece;
const Token = require('../../models/token').Token;
const errors = require('../../errors');

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

        return Game.findById(gameId);
    })
    .then(gameToUpdate => {
        gameToUpdate.userList.push(req.user._id);

        return gameToUpdate.save();
    })
    .then(() => {
        res.JSON(`Added to ${gameId}`)
    })
    .catch(next);
};