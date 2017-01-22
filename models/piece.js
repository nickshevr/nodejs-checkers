const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    color: Types.Boolean, // 0 - black, 1 - white
    position: {
        x: Types.Number,
        y: Types.Number
    },
    board: {
        type: Types.ObjectId,
        required: true
    }
});
const Piece = mongoose.model('Piece', schema);

exports.Piece = Piece;