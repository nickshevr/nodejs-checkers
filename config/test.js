module.exports = {
    "server": {
        "host": "127.0.0.1",
        "port": 3040
    },

    "database": {
        "uri" : "mongodb://localhost/checkers-test",
        "options": {
            "user": "",
            "pass": "",
            "server" : {
                "socketOptions": {
                    "keepAlive": 1
                }
            }
        }
    }
};
