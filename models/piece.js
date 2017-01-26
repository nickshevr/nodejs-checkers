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

schema.statics.EMPTY_FIELD = 'EMPTY_FIELD';
schema.statics.BLACK_PIECE = 'BLACK_PIECE';
schema.statics.WHITE_PIECE = 'WHITE_PIECE';

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

schema.statics.getFieldValue = function getFieldValue(gameId, x, y) {
    return this.constructor.find({
        gameId,
        "position.x": x,
        "position.y": y,
    })
    .limit(1)
    .lean()
    .then(positionValue => {
        if (!positionValue[0]) {
            return this.constructor.statics.EMPTY_FIELD;
        }

        return positionValue[0].color === 0 ? this.constructor.statics.BLACK_PIECE : this.constructor.statics.WHITE_PIECE;
    })
};

schema.statics.modePiece = function movePiece (pieceId, x, y) {

};

const Piece = mongoose.model('Piece', schema);

exports.Piece = Piece;