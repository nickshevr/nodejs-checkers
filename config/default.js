module.exports = {
    "server": {
        "host": "127.0.0.1",
        "port": 3040
    },
    "session": {
        "key": "sid",
        "secret": "jasdfnlwebvcaserjha3wkh",
        "cookie": {
            path: "/",
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            rolling: true
        }
    },
    "database": {
        "uri" : "mongodb://localhost/checkers",
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
