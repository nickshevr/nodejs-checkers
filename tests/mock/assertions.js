'use strict';

const should = require('should');

exports = module.exports = should;

should.Assertion.add(
    'User',

    function() {
        this.params = { operator: 'to be a valid user' };

        const user = this.obj;
        should.exists(user);
        user.should.be.an.Object;
        user.should.have.properties(['name', '_id']);
    },
    true
);