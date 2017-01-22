'use strict';
const EventEmitter = require('events');
const mongoose = require('mongoose');
const config   = require('config').get('database');
mongoose.Promise = global.Promise;


class Database extends EventEmitter {
    static connect() {
        // Config
        mongoose.connect(config.uri, config.options);
    }

    constructor() {
        super();

        // Create connection
        Database.connect();

        // Connection instance
        var db = mongoose.connection;

        // Callbacks
        db.on('error', function(err) {
            console.log('[DB]: Connection error: ' + err.message);
        });

        db.once('open', function() {
            console.log('[DB]: Connected to DB!');
        });

        db.on('disconnected', Database.connect);

        // Return connection instance
        return mongoose.connection;
    }
}

// This is singleton
module.exports = new Database();
