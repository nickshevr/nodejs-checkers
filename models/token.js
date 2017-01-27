const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const crypto = require('crypto');

const Schema = new mongoose.Schema({
    value: {
        type: Types.String,
        unique: true,
        required: true
    },

    type: {
        type: Types.String,
        required: true
    },

    gameId: {
        type: Types.ObjectId,
        required: true
    }
});

const generateToken = function generateToken(tokenLength = 6) {
    return new Promise((resolve, reject) => {
        return crypto.randomBytes(tokenLength, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString('hex'));
            }
        });
    });
};

Schema.statics.INVITE_TYPE = 'INVITE_TOKEN';

Schema.statics.createTokenForGame = function createTokenForGame(gameId) {
    return generateToken()
        .then(generatedToken => {
            return this.constructor.create({
                value: generatedToken,
                type: this.constructor.INVITE_TYPE,
                gameId: gameId
            })
        });
};

const Token = mongoose.model('Token', Schema);

exports.Game = Token;