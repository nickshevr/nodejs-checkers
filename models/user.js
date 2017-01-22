const mongoose = require('mongoose');
const errors = require('../errors');
const crypto = require('crypto');
const Types = mongoose.Types;

const schema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        default: Types.ObjectId,
        unique: true
    },
    username: {
        type: Types.String,
        unique: true,
        required: true,
        default: () => Math.random().toString(36).substr(2, 9)
    },
    hashedPassword: {
        type: Types.String,
        required: true,
        private: true
    },
    currentGame: Types.ObjectId
});

schema.methods.encryptPassword = function (password) {
    if (!password) throw new errors.NotAcceptable('$password must be specified');

    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

const User = mongoose.model('User', schema);

exports.User = User;