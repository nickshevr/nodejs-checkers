const setupDB = require('../db/setupDB');
const app = require('../app');
const request = require('supertest');
const agent = request.testAgent(app);
const DB_PATH = './test/mock/base';

describe('#{POST} /login', () => {

    before(async function() {
        await setupDB(DB_PATH);
    });


});
