const config = require('config');
const exec = require('child_process').exec;

module.exports = function setupDB(path, callback) {
    if(!callback) callback = () => {};
    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV !== 'test') {
            const err = new Error('Environment of system must be `test`');
            reject(err); return callback(err);
        }

        const name = config.get('database').uri.split('/').pop();

        const cmd = `
            for file in $(ls -1 ${path}); do
                mongoimport --drop --db ${name} --type=json --jsonArray ${path}/$file;
            done
        `;

        exec(cmd, (err, stdout, stderr) => {
            if(err) {
                reject(err);

                if(callback) {
                    return callback(err);
                } else {
                    return;
                }
            }

            resolve(stdout, stderr);

            if(callback) {
                return callback(null, stdout, stderr);
            }
        });
    });
};
