const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true
    },
    userList: [Types.ObjectId],
    board: {
        type: Types.ObjectId,
        required: true
    },
    playerTurn: { // 0/1 elem in userList array
        type: Types.Boolean,
        default: false
    }
});

//1- user want to play black, 0 - user want to play white
schema.statics.createGameForUser = function (userId, color) {
    return this.model('game').create({
        userList: [userId],
        playerTurn: color
    })
    .then(createdGame => {
        return this.model('token').createTokenForGame(createdGame._id)
    });
};

const Game = mongoose.model('Game', schema);

exports.Game = Game;