const setupDB = require('../db/setupDB');
const app = require('../app');
const request = require('supertest');
const defaults = require('superagent-defaults');
const agent = defaults(request(app));
const DB_PATH = './tests/mock/base';
const User = require('../models/user').User;
const should = require('should');

describe('Game routes', () => {

    before(async function() {
        await setupDB(DB_PATH);
    });

    describe('#POST /api/:username/game', async () => {
        let response = null;

        before(async () => {
            await agent.post('/api/signup')
                .send({
                    username: 'Tester1',
                    password: '123456'
                });

            await agent.post('/api/login')
                .send({
                    login: 'Tester1',
                    password: '123456'
                });

            response = await agent.post('/api/tester1/game');
        });

        it('Should return inviteTokenValue', async () => {
            console.log(response.body);
        })
    })


});
