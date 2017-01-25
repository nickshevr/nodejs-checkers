const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
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
const Game = mongoose.model('Game', schema);

exports.Game = Game;