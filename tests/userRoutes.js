const setupDB = require('../db/setupDB');
const app = require('../app');
const request = require('supertest');
const defaults = require('superagent-defaults');
const agent = defaults(request(app));
const DB_PATH = './tests/mock/base';
const User = require('../models/user').User;
const should = require('should');

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

        it('Should return user info', async () => {
            response.body.should.have.properties(['_id', 'username']);
            response.body.should.not.have.properties(['hashedPassword', 'salt']);
        });

        it('Should create userObject intoDB', async () => {
            const user = await User.findOne({ username: 'Tester1'});

            should.exist(user);
            user.should.have.properties(['_id', 'username', 'hashedPassword', 'salt']);
        });

        it('Shouldnt create user with the same username', async () => {
            const res = await agent.post('/api/signup')
                .send({
                    username: 'Tester1',
                    password: '123456'
                });

            res.body.should.be.deepEqual({
                statusCode: 406,
                name: 'NotAcceptable',
                message: 'Tester1 has been already taken'
            });
        });
    });

    describe('#POST /api/login', async () => {
        before(async () => {
            await setupDB(DB_PATH);

            await agent.post('/api/signup')
                .send({
                    username: 'Tester1',
                    password: '123456'
                });
        });

        it('Login with valid data', async () => {
            const res = await agent.post('/api/login')
                .send({
                    login: 'Tester1',
                    password: '123456'
                });

            res.body.should.have.properties(['_id', 'username']);
        });

        it('Login with invalid data ${password}', async () => {
            const res = await agent.post('/api/login')
                .send({
                    login: 'Tester1',
                    password: '123123'
                });

            res.body.should.be.deepEqual({
                statusCode: 403,
                name: 'AccessDenied',
                message: 'Wrong password'
            });
        });


        it('Login with invalid data ${login}', async () => {
            const res = await agent.post('/api/login')
                .send({
                    login: 'WrongLogin',
                    password: '123123'
                });

            res.body.should.be.deepEqual({
                statusCode: 403,
                name: 'AccessDenied',
                message: 'Wrong username (login)'
            });
        });
    });

    describe('#POST /api/logout', async () => {
        before(async () => {
            await setupDB(DB_PATH);

            await agent.post('/api/signup')
                .send({
                    username: 'Tester1',
                    password: '123456'
                });
        });
    });
});
