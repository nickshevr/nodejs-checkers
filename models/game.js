const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    userList: [Types.ObjectId]
});
const Game = mongoose.model('Game', schema);

exports.Game = Game;