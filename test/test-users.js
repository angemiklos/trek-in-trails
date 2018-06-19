'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', () => {
  const nickname = 'exampleName';
  const username = 'exampleUser@gmail.com';
  const email = 'exampleUser@gmail.com';
  const password = 'examplePass';
  const prefCity = 'Phoenix';
  const prefState = 'Arizona';
  const nicknameB = 'exampleNameB';
  const usernameB = 'exampleUserB@gmail.com';
  const emailB = 'exampleUserB@gmail.com';
  const passwordB = 'examplePassB';
  const prefCityB = 'Denver';
  const prefStateB = 'Colorado';

  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  beforeEach(() => { });

  afterEach(() => {
    return User.remove({});
  });

  describe('/api/users', () => {
    describe('POST', () => {
      it('Should reject users with missing username', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            password,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with missing password', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-string username', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username: 1234,
            password,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-string password', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password: 1234,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-string first name', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname: 1234,
            username,
            password,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('nickname');
          });
      });
      it('Should reject users with non-string city name', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password,
            prefCity: 1234,
            prefState
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
            expect(res.body.location).to.equal('prefCity');
          });
      });
      it('Should reject users with non-trimmed username', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username: ` ${username} `,
            password,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-trimmed password', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password: ` ${password} `,
            prefCity,
            prefState
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
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with empty username', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username: '',
            password,
            prefCity,
            prefState
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
              'Must be at least 7 characters long'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with password less than six characters',() => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password: '12345',
            prefCity,
            prefState
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
              'Must be at least 6 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with password greater than 12 characters', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password: new Array(13).fill('a').join(''),
            prefCity,
            prefState
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
              'Must be at most 12 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with duplicate username', () => {
        // Create an initial user
        return User.create({
          nickname,
          username,
          password,
          email,
          prefCity,
          prefState
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/api/users').send({
              nickname,
              username,
              password,
              prefCity,
              prefState
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
              'Username already taken'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should create a new user', () => {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password,
            prefCity,
            prefState
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'nickname',
              'username',
              'email',
              'prefCity',
              'prefState'
            );
            expect(res.body.nickname).to.equal(nickname);
            expect(res.body.username).to.equal(username);
            expect(res.body.email).to.equal(email);
            expect(res.body.prefCity).to.equal(prefCity);
            expect(res.body.prefState).to.equal(prefState);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.nickname).to.equal(nickname);
            expect(user.email).to.equal(email);
            expect(user.prefCity).to.equal(prefCity);
            expect(user.prefState).to.equal(prefState);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      it('Should trim city name', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            nickname,
            username,
            password,
            prefCity: ` ${prefCity} `,
            prefState
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'nickname',
              'username',
              'email',
              'prefCity',
              'prefState'
            );
            expect(res.body.nickname).to.equal(nickname);
            expect(res.body.username).to.equal(username);
            expect(res.body.email).to.equal(email);
            expect(res.body.prefCity).to.equal(prefCity);
            expect(res.body.prefState).to.equal(prefState);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.prefCity).to.equal(prefCity);
          });
      });
    });

    describe('GET', () => {
      it('Should return an empty array initially', () => {
        return chai.request(app).get('/api/users').then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
      it('Should return an array of users', () => {
        return User.create(
          {
            nickname,
            username,
            password,
            email,
            prefCity,
            prefState
          },
          {
            nickname: nicknameB,
            username: usernameB,
            password: passwordB,
            email   : emailB,
            prefCity: prefCityB,
            prefState: prefStateB
          }
        )
          .then(() => chai.request(app).get('/api/users'))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              nickname,
              username,
              email,
              prefCity,
              prefState
            });
            expect(res.body[1]).to.deep.equal({
              nickname: nicknameB,
              username: usernameB,
              email: emailB,
              prefCity: prefCityB,
              prefState: prefStateB
              });
          });
      });
    });
  });
});
