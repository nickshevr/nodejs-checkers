const mongoose = require('mongoose');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true
    },
    color: Types.Boolean, // 0 - black, 1 - white
    pieceType: { // 1 - crown, 0 - standart
        type: Types.Boolean,
        default: false
    },
    position: {
        x: {
            type: Types.Number,
            min: 0,
            max: 7
        },
        y: {
            type: Types.Number,
            min: 0,
            max: 7
        }
    },
    gameId: {
        type: Types.ObjectId,
        required: true
    }
});

schema.statics.basePieceInit = function basePieceInit(gameId) {
    const promises = [];

    // create all of the black pieces
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            if ((i + j) % 2 == 1) {
                promises.push(this.constructor.create({
                    gameId,
                    position: {
                        x: j,
                        y: i
                    },
                    color: 0
                }))
            }
        }
    }

    // create all of the white pieces
    for (let i = 7; i > 4; i--) {
        for (let j = 0; j < 7; j++) {
            if ((i + j) % 2 == 1) {
                promises.push(this.constructor.create({
                    gameId,
                    position: {
                        x: j,
                        y: i
                    },
                    color: 1
                }))
            }
        }
    }

    return Promise.all(promises);
};

const Piece = mongoose.model('Piece', schema);

exports.Piece = Piece;