const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const JWT_SECRET =
  "2fb53e1e4f5a7379f1b364118c3c16ac8b0f86d89cf7c3b6d2675e1f7f3d8ba9";

// Sample test users and events
const sampleUser = {
  username: "testUser",
  password: "testPassword",
  amount: 0,
};
const sampleEvent = {
  eventName: "Test Event",
  eventDescription: "Test Event Description",
  eventGoal: 500,
  eventDeadline: "2024-12-31",
  username: sampleUser.username,
};
let authToken = "";
console.log("App" + app);
// Mock database query responses
const db = require("../dbConfig.js");

// Test suite for the API
describe("Community Event Funding Platform API", () => {
  before((done) => {
    let user_id =0;
    let event_id=0;
    var selectQuery = "select user_id FROM users_table where username= 'testUser'";
    db.query(selectQuery, (err,rows) => {
      if (err) return done(err);

      user_id = rows[0].user_id;
    });

    selectQuery = "select event_id FROM events_table where event_title= 'Test Event'"
    db.query(selectQuery, (err, rows) => {
      if (err) return done(err);

      event_id = rows[0].event_id;
    });

    var deleteQuery = "DELETE FROM users_funds where user_id="+user_id;
    db.query(deleteQuery, (err) => {
      if (err) return done(err);
    });
    // Clear users table before tests
      deleteQuery = "DELETE FROM users_table where user_id=" + user_id;
    db.query(deleteQuery, (err) => {
      if (err) return done(err);
    });

    deleteQuery ="delete from events_table where event_id ="+ event_id;
    db.query(deleteQuery, (err) => {
      if (err) return done(err);
    });

    // deleteQuery ="delete from events_table where event_title= 'Test Event'";
    // db.query(deleteQuery, (err) => {
    //   if (err) return done(err);
    // });
    // deleteQuery = "DELETE FROM users_table where username = 'testUser'";
    // db.query(deleteQuery, (err) => {
    //   if (err) return done(err);
    // });
 

    deleteQuery ="delete from events_table where event_title ='Unauthorized Event'";
    db.query(deleteQuery, (err) => {
      if (err) return done(err);
    });

    done();
  });
  // Test the /register endpoint
  describe("POST /register", () => {
    it("should register a new user", (done) => {
      request(app)
        .post("/users/register")
        .send(sampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return "User exists" if the user already exists', (done) => {
      request(app)
        .post("/users/register")
        .send(sampleUser) // Attempt to register same user again
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.equal("User exists");
          done();
        });
    });
  });

  // Test the /login endpoint
  describe("POST /login", () => {
    it("should log in an existing user and return a token", (done) => {
      request(app)
        .post("/users/login")
        .send({ username: sampleUser.username, password: sampleUser.password })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("token");
          authToken = res.body.token; // Save token for future authenticated requests
          done();
        });
    });

    it('should return "User does not exists" for invalid username', (done) => {
      request(app)
        .post("/users/login")
        .send({ username: "Username1", password: "password1" })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done();
        });
    });

    it('should return "Invalid password" for incorrect password', (done) => {
      request(app)
        .post("/users/login")
        .send({ username: sampleUser.username, password: "password1" })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).to.equal("Invalid password");
          done();
        });
    });
  });

  // Test the /createEvent endpoint (requires authentication)
  describe("POST /createEvent", () => {
    it("should create a new event when the user is authenticated", (done) => {
      request(app)
        .post("/users/createEvent")
        .set("Authorization", `Bearer ${authToken}`)
        .send(sampleEvent)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.equal("Event Created");
          done();
        });
    });

    it("should return 401 if the user is not authenticated", (done) => {
      request(app)
        .post("/users/createEvent")
        .send({
          eventName: "Unauthorized Event",
          eventDescription: "Unauthorized Event Description",
          eventGoal: 500,
          eventDeadline: "2024-12-31",
          username: sampleUser.username,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  // Test the /events endpoint (requires authentication)
  describe("GET /events", () => {
    it("should return the list of all events when the user is authenticated", (done) => {
      request(app)
        .get("/users/events")
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should return 401 if the user is not authenticated", (done) => {
      request(app)
        .get("/users/events")
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  // Test the /getMyEvents endpoint (requires authentication)
  describe("GET /getMyEvents", () => {
    it("should return the list of user’s events when the user is authenticated", (done) => {
      request(app)
        .get("/users/getMyEvents")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ creatorId: sampleUser.username })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should return 401 if the user is not authenticated", (done) => {
      request(app)
        .get("/users/getMyEvents")
        .query({ creatorId: sampleUser.username })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe("Simulated Blockchain API", () => {
    describe("GET /balance", () => {
      it("should return the correct balance for user", (done) => {
        request(app)
          .get("/blockchain/balance")
          .set("Authorization", `Bearer ${authToken}`)
          .query({ username: sampleUser.username })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
      });

      it("should return 500 for a non-existent user", (done) => {
        request(app)
          .get("/blockchain/balance")
          .set("Authorization", `Bearer ${authToken}`)
          .query({ username: "Username1" })
          .end((err, res) => {
            expect(res.status).to.equal(500);
            done();
          });
      });
    });

    describe("POST /mint", () => {
      it("should mint tokens for user", (done) => {
        const requestBody = {
          username: "testUser",
          amount: 500,
        };

        request(app)
          .post("/blockchain/mint")
          .set("Authorization", `Bearer ${authToken}`)
          .send(requestBody)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
      });

      it("should return 500 if the user to mint tokens for is not found", (done) => {
        const requestBody = {
          username: "Username1", // Non-existent user
          amount: 500,
        };

        request(app)
          .post("/blockchain/mint")
          .set("Authorization", `Bearer ${authToken}`)
          .send(requestBody)
          .end((err, res) => {
            expect(res.status).to.equal(500);
            done();
          });
      });
    });

    describe("POST /transfer", () => {
      it("should transfer tokens from user to event", (done) => {
        const requestBody = {
          username: "testUser",
          eventId: 2,
          amount: 200,
        };

        request(app)
          .post("/blockchain/transfer")
          .set("Authorization", `Bearer ${authToken}`)
          .send(requestBody)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
      });

      it("should return 500 if a user is not found", (done) => {
        const requestBody = {
          username: "Username1",
          eventId: 2,
          amount: 50,
        };

        request(app)
          .post("/blockchain/transfer")
          .set("Authorization", `Bearer ${authToken}`)
          .send(requestBody)
          .end((err, res) => {
            expect(res.status).to.equal(500);
            done();
          });
      });
    });
  });
});
