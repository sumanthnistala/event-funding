const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../dbConfig.js");
const JWT_SECRET =
  "2fb53e1e4f5a7379f1b364118c3c16ac8b0f86d89cf7c3b6d2675e1f7f3d8ba9";

let users = [];
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post("/register", (req, res) => {
  const { username, password, amount } = req.body;
  var insertQuery =
    "INSERT INTO users_table (user_id, username, user_password, tokenbalance) VALUES (?, ?, ?, ?)";
  var values = [0, username, password, amount];

  var selectquery = "select * from users_table where username='" + username +"'";
  db.connect(function (err) {
    if (err) throw err;
    db.query(selectquery, (err, rows) => {
      if (err) {
        throw err;
      } else {
        console.log(rows[0]);
        if (rows[0] == null) {
          db.query(insertQuery, values, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              console.log("Number of records inserted: " + result.affectedRows);
              const token = jwt.sign({ username, password }, JWT_SECRET);
              res.json({ token });
            }
          });
        }
        else
        {
          res.json("User exists");
        }
      }
    });
  });
});

// Login User
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  var selectquery = "select * from users_table where username='" + username +"'";
  console.log("Un" + username);
  db.connect(function (err) {
    if (err) throw err;
    db.query(selectquery, (err, rows) => {
      if (err) {
        throw err;
      } else {
        console.log("Rows[0]"+rows[0]);
        console.log(Object.keys(rows[0]));
        if (rows[0] == null) {
          console.log(1);
          res.status(500).send("User does not exists");
        } else if (rows[0].user_password != password) {
          console.log(2);
          res.status(500).send("Invalid password");
        } else {
          console.log(3);
          const token = jwt.sign({ username, password }, JWT_SECRET);
          console.log(token);
          res.json({ token });
        }
      }
    });
  });
});

// Create Event
router.post("/createEvent", authenticateToken,(req, res) => {
  const { eventName, eventDescription, eventGoal, eventDeadline, username } =
    req.body;
  const password = "";
  var query =
    "INSERT INTO events_table (event_id, event_title, event_description, funding_goal, event_deadline, creatorId, funds_raised) VALUES (?,?, ?, ?, ?, ?,?)";
  var values = [
    0,
    eventName,
    eventDescription,
    eventGoal,
    eventDeadline,
    username,
    0,
  ];
  db.connect(function (err) {
    if (err) throw err;
    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log("Number of records inserted: " + result.affectedRows);
        res.json("Event Created");
      }
    });
  });
});

router.get("/events",authenticateToken, async (req, res) => {
  var query = "select * from events_table";
  db.connect(function (err) {
    if (err) throw err;
    db.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });
});

router.get("/eventDescription",authenticateToken, (req, res) => {
  var query = "select * from events_table where event_id=" + req.query["id"]
  db.connect(function (err) {
    if (err) throw err;
    db.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });
});

router.get("/getMyEvents", authenticateToken, (req, res) => {
  var query =
    "select * from events_table where creatorId='" + req.query["creatorId"]+"'";
  db.connect(function (err) {
    if (err) throw err;
    db.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log(rows);
        res.json(rows);
      }
    });
  });
});

router.post("/checkAccount", (req, res) => {
  const { email } = req.body;

  console.log(req.body);

  const user = db
    .get("users_table")
    .value()
    .filter((user) => email === user.email);

  console.log(user);

  res.status(200).json({
    status: user.length === 1 ? "User exists" : "User does not exist",
    userExists: user.length === 1,
  });
});

router.delete("/deleteEvent", authenticateToken, (req, res) => {
  var query = "delete from events_table where id=" + req.query["id"];

  db.connect(function (err) {
    if (err) throw err;
    db.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log(rows);
        res.json("Event delete successfully");
      }
    });
  });
});
module.exports = router;
