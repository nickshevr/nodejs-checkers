const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true
    },
    userList: [Types.ObjectId],
    playerTurn: { // 0/1 elem in userList array
        type: Types.Boolean,
        default: false
    }
});

//1- user want to play black, 0 - user want to play white
schema.statics.createGameForUser = function (userId, color) {
    let createdGame = null;

    return this.model('game').create({
        userList: [userId],
        playerTurn: color
    })
    .then(createdGameDB => {
        createdGame = createdGameDB;

        return this.model('token').createTokenForGame(createdGameDB._id)
    })
    .then(generatedToken => {
        return [createdGameDB, generatedToken];
    })
};

const Game = mongoose.model('Game', schema);

exports.Game = Game;