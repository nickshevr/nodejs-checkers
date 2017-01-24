const setupDB = require('../db/setupDB');
const app = require('../app');
const request = require('supertest');
const defaults = require('superagent-defaults');
const agent = defaults(request(app));
const DB_PATH = './tests/mock/base';
const User = require('../models/user').User;

describe('User routes', () => {

    before(async function() {
        await setupDB(DB_PATH);
    });

    describe('#POST /api/signup', async () => {
        let response = null;

        before(async () => {
            response = await agent.post('/api/signup')
                .send({
                    username: 'Tester1',
                    password: '123456'
                });
        });

        it('Should return good parameters', async () => {
            console.log(response.body);
        });

        it('Should create userObject intoDB', async () => {
            const user = await User.findOne({ username: 'Tester1'});

            console.log(user);
        });
    });
});
