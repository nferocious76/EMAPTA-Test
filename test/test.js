'use strict';

    require('chai').should();
const expect = require('chai').expect;
const request = require('supertest');

const api = request('http://localhost:4776');

describe('CSV PARSER', () => {
    
    it('GET /read_csv', done => {

        api
        .get('/read_csv')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);

            const data = res.body.data;
            expect(data).to.have.lengthOf.above(0);

            const message = data[0];
            message.should.have.property('Message Id');
            message.should.have.property('Body');
            message.should.have.property('Delivery Status');

            done();
        });
    });
});