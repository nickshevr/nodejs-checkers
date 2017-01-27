'use strict';
const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const errors = require('../errors');

const schema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true
    },
    title: Types.String,
    userList: [Types.ObjectId],
    playerTurn: { // 0/1 elem in userList array
        color: {
            type: Types.Boolean,
            default: false
        },
        catOnlyEat: {
            type: Types.Boolean,
            default: false
        }
    }
});

schema.methods.changeTurnMethod = function changeTurn() {
    this.playerTurn.color = !this.playerTurn.color;
    this.playerTurn.canEatOnly = false;

    return this.save();
};

schema.methods.setOnlyEatMethod = function setOnlyEat() {
    this.playerTurn.canEatOnly = false;

    return this.save();
};

schema.statics.findById = function (gameId){
    return this.model('game').find({
        _id: gameId
    })
    .limit(1)
    .lean()
    .then(gameDB => {
        if (!gameDB[0]) {
            throw new errors.NotFoundError('Wrong gameId');
        }

        return gameDB[0];
    });
};

schema.statics.changeTurn = function changeTurnStatics(gameId) {
    return this.model('game').findById(gameId)
    .then(gameDB => {
        return gameDB.changeTurn();
    });
};

schema.statics.setOnlyEat = function (gameId) {
    return this.model('game').findById(gameId)
    .then(gameDB => {
        return gameDB.changeTurn();
    });
};

//1- user want to play black, 0 - user want to play white
schema.statics.createGameForUser = function (userId, color, title) {
    let createdGame = null;

    return this.model('game').create({
        userList: [userId],
        playerTurn: color,
        title
    })
    .then(createdGameDB => {
        createdGame = createdGameDB;

        return this.model('token').createTokenForGame(createdGameDB._id)
    })
    .then(generatedToken => {
        return [createdGame, generatedToken];
    })
};

schema.statics.getGamesForUser = function (userId) {
    return this.model('game').find({
        userList: { $elemMatch: userId }
    }).lean();
};

const Game = mongoose.model('game', schema);

exports.Game = Game;