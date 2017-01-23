const mongoose = require('mongoose');
const errors = require('../errors');
const crypto = require('crypto');
const Types = mongoose.Schema.Types;

const schema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        default: Types.ObjectId,
        unique: true
    },
    username: {
        type: Types.String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: Types.String,
        required: true
    },
    salt: {
        type: Types.String,
        required: true
    },
    currentGame: Types.ObjectId
});

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = `${Math.random()}`;
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
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