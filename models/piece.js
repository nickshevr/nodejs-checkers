const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const errors = require('../errors');

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
    },
    isEaten: {
        type: Types.Boolean,
        default: false
    }
});

schema.statics.EMPTY_FIELD = 'EMPTY_FIELD';
schema.statics.BLACK_PIECE = 'BLACK_PIECE';
schema.statics.WHITE_PIECE = 'WHITE_PIECE';

// 0 - black, 1 - white
function firstValidateMove (color, oldX, oldY, newX, newY) {
    if (color) {
        return (Math.abs(oldX - newX) === 1 && newY - oldY === 1) || (Math.abs(oldY - newY) === 1 && newX - oldX === 1)
    }

    return (Math.abs(oldX - newX) === 1 && oldY - newY === 1) || (Math.abs(oldY - newY) === 1 && oldX - newX === 1)
}

function secondValidateMove  (color, oldX, oldY, newX, newY) {
    if (color) {
        return (Math.abs(oldX - newX) === 2 && newY - oldY === 2) || (Math.abs(oldY - newY) === 2 && newX - oldX === 2)
    }

    return (Math.abs(oldX - newX) === 2 && oldY - newY === 2) || (Math.abs(oldY - newY) === 2 && oldX - newX === 2)
}

schema.statics.basePieceInit = function basePieceInit(gameId) {
    const promises = [];

    // create all of the white pieces
    for (let i = 0; i < 3; i++) {
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

    // create all of the black pieces
    for (let i = 7; i > 4; i--) {
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

    return Promise.all(promises);
};

schema.statics.getFieldValue = function getFieldValue(gameId, x, y) {
    return this.constructor.find({
        gameId,
        "position.x": x,
        "position.y": y
    })
    .limit(1)
    .lean()
    .then(positionValue => {
        if (!positionValue[0] || positionValue.isEaten) {
            return this.constructor.statics.EMPTY_FIELD;
        }

        return positionValue[0].color === 0 ? this.constructor.statics.BLACK_PIECE : this.constructor.statics.WHITE_PIECE;
    });
};

schema.statics.movePiece = function movePiece (gameId, pieceId, newX, newY) {
    let pieceDB = null;
    let gameDB = null;

    return this.model('piece').getFieldValue(gameId, newX, newY)
        .then(newPositionValue => {
            if (newPositionValue !== this.model('piece').EMPTY_FIELD) {
                throw new errors.ValidationError('Position is not empty');
            }

            return Promise.all([this.model('piece').findById(pieceId), this.model('game').findById(gameId)]);
        })
        .then(pieceData => {
            pieceDB = pieceData[0];
            gameDB = pieceData[1];

            if (pieceDB.isEaten){
                throw new errors.ValidationError('Piece has been eaten');
            }

            return this.model('piece').getFieldValue(gameId, Math.abs(newX - pieceDB.position.x)/2,  Math.abs(newY - pieceDB.position.y)/2);
        })
        .then(secondLinePiece => {
            if (firstValidateMove(pieceDB.color, pieceDB.position.x, pieceDB.position.y, newX, newY)) {
                pieceDB.position.x = newX;
                pieceDB.position.y = newY;
            }

            if (secondValidateMove(pieceDB.color, pieceDB.position.x, pieceDB.position.y, newX, newY) && secondLinePiece.color !== pieceDB.color) {
                pieceDB.position.x = newX;
                pieceDB.position.y = newY;
            }

            return pieceDB.save();
        });
};

const Piece = mongoose.model('Piece', schema);

exports.Piece = Piece;