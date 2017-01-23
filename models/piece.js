const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    color: Types.Boolean, // 0 - black, 1 - white
    pieceType: { // 1 - crown, 0 - standart
        type: Types.Boolean,
        default: false
    },
    position: {
        x: {
            type: Types.Number,
            min: 0,
            max: 8
        },
        y: {
            type: Types.Number,
            min: 0,
            max: 8
        }
    },
    board: {
        type: Types.ObjectId,
        required: true
    }
});
const Piece = mongoose.model('Piece', schema);

exports.Piece = Piece;