'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Hike } = require('../hikes');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/hike', () => {
  const trailName = 'Trail A';
  const owner = 'exampleUser@gmail.com';
  const visibility = 'public';
  const trailNameB = 'Trail B';
  const ownerB = 'exampleUserB@gmail.com';
  const visibilityB = 'private';
  
  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  beforeEach(() => { });

  afterEach(() => {
    return Hike.remove({});
  });

  describe('/api/hikes', () => {
    describe('POST', () => {
      it('Should reject hikes with missing trailName', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            owner,
            visibility
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('trailName');
          });
      });
      it('Should reject hikes with missing owner', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName,
            visibility
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('owner');
          });
      });
      it('Should reject hikes with non-string trailName', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName: 1234,
            owner,
            visibility
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('trailName');
          });
      });
      it('Should reject hikes with non-string owner', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName,
            owner: 1234,
            visibility
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('owner');
          });
      });
      it('Should reject hikes with invalid visibility', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName,
            owner,
            visibility : 'shared'
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Invalid value: public or private expected'
            );
            expect(res.body.location).to.equal('visibility');
          });
      });
      it('Should reject hikes with non-trimmed trailName', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName: 'Trail A ',
            owner,
            visibility
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('trailName');
          });
      });
      it('Should reject hikes with empty trailName', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName: '',
            owner,
            visibility
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 character(s) long'
            );
            expect(res.body.location).to.equal('trailName');
          });
      });
      it('Should reject hikes with duplicate trailName', () => {
        // Create an initial hike
        return Hike.create({
          trailName,
          owner,
          visibility
      })
          .then(() =>
            // Try to create a second hike with the same trailName
            chai.request(app).post('/api/hikes').send({
              trailName,
              owner,
              visibility
              })
          )
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Trail Name already taken'
            );
            expect(res.body.location).to.equal('trailName');
          });
      });
      it('Should create a new trail', () => {
        return chai
          .request(app)
          .post('/api/hikes')
          .send({
            trailName,
            owner,
            visibility
         })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'trailName',
              'owner',
              'visibility'
            );
            expect(res.body.trailName).to.equal(trailName);
            expect(res.body.owner).to.equal(owner);
            expect(res.body.visibility).to.equal(visibility);
            return Hike.findOne({
              trailName
            });
          })
          .then(hike => {
            expect(hike).to.not.be.null;
            expect(hike.trailName).to.equal(trailName);
            expect(hike.owner).to.equal(owner);
            expect(hike.visibility).to.equal(visibility);
          });
      });
    });

    describe('GET', () => {
      it('Should return an empty array initially', () => {
        return chai.request(app).get('/api/hikes').then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
      it('Should return an array of hikes', () => {
        return Hike.create(
          {
            trailName,
            owner,
            visibility
          },
          {
            trailName: trailNameB,
            owner: ownerB,
            visibility: visibilityB
          }
        )
          .then(() => chai.request(app).get('/api/hikes'))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              trailName,
              owner,
              visibility
            });
            expect(res.body[1]).to.deep.equal({
              trailName: trailNameB,
              owner: ownerB,
              visibility: visibilityB
                });
          });
      });
    });
  });
});
