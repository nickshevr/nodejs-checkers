'use strict';

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

const generateToken = function generateToken() {
    return new Promise((resolve, reject) => {
        return crypto.randomBytes(6, (err, data) => {
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
            return this.model('token').create({
                value: generatedToken,
                type: this.model('token').INVITE_TYPE,
                gameId: gameId
            })
        });
};

const Token = mongoose.model('token', Schema);

exports.Game = Token;