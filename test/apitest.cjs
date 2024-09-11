const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const JWT_SECRET = '2fb53e1e4f5a7379f1b364118c3c16ac8b0f86d89cf7c3b6d2675e1f7f3d8ba9';

// Sample test users and events
const sampleUser = { username: 'testUser', password: 'testPassword', amount: 100 };
let authToken = '';

// Mock database query responses
const db = require('../dbConfig.js');
db.query = (query, values, callback) => {
  // Mock responses based on query type
  if (query.includes('INSERT INTO users_table')) {
    callback(null, { affectedRows: 1 });
  } else if (query.includes('select * from users_table where username')) {
    if (values[0] === 'testUser') {
      callback(null, [{ username: 'testUser', user_password: 'testPassword' }]);
    } else {
      callback(null, []);
    }
  } else if (query.includes('INSERT INTO events_table')) {
    callback(null, { affectedRows: 1 });
  } else {
    callback(null, []);
  }
};

// Test suite for the API
describe('Community Event Funding Platform API', () => {

  // Test the /register endpoint
  describe('POST /register', () => {
    it('should register a new user', (done) => {
      request(app)
        .post('users/register')
        .send(sampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          authToken = res.body.token; // Save token for future authenticated requests
          done();
        });
    });

    it('should return "User exists" if the user already exists', (done) => {
      request(app)
        .post('users/register')
        .send(sampleUser) // Attempt to register same user again
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.equal('User exists');
          done();
        });
    });
  });

  // Test the /login endpoint
  describe('POST /login', () => {
    it('should log in an existing user and return a token', (done) => {
      request(app)
        .post('/login')
        .send({ username: sampleUser.username, password: sampleUser.password })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          authToken = res.body.token; // Save token for future authenticated requests
          done();
        });
    });

    it('should return "User does not exists" for invalid username', (done) => {
      request(app)
        .post('/login')
        .send({ username: 'nonExistingUser', password: 'anyPassword' })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).to.equal('User does not exists');
          done();
        });
    });

    it('should return "Invalid password" for incorrect password', (done) => {
      request(app)
        .post('/login')
        .send({ username: sampleUser.username, password: 'wrongPassword' })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).to.equal('Invalid password');
          done();
        });
    });
  });

  // Test the /createEvent endpoint (requires authentication)
  describe('POST /createEvent', () => {
    it('should create a new event when the user is authenticated', (done) => {
      request(app)
        .post('/createEvent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          eventName: 'Test Event',
          eventDescription: 'Test Event Description',
          eventGoal: 500,
          eventDeadline: '2024-12-31',
          username: sampleUser.username,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.equal('Event Created');
          done();
        });
    });

    it('should return 401 if the user is not authenticated', (done) => {
      request(app)
        .post('/createEvent')
        .send({
          eventName: 'Unauthorized Event',
          eventDescription: 'Unauthorized Event Description',
          eventGoal: 500,
          eventDeadline: '2024-12-31',
          username: sampleUser.username,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  // Test the /events endpoint (requires authentication)
  describe('GET /events', () => {
    it('should return the list of all events when the user is authenticated', (done) => {
      request(app)
        .get('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should return 401 if the user is not authenticated', (done) => {
      request(app)
        .get('/events')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  // Test the /getMyEvents endpoint (requires authentication)
  describe('GET /getMyEvents', () => {
    it('should return the list of user’s events when the user is authenticated', (done) => {
      request(app)
        .get('/getMyEvents')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ creatorId: sampleUser.username })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should return 401 if the user is not authenticated', (done) => {
      request(app)
        .get('/getMyEvents')
        .query({ creatorId: sampleUser.username })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});
