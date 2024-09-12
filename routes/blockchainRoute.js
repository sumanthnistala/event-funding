const express = require("express");
const router = express.Router();
const db = require("../dbConfig.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "2fb53e1e4f5a7379f1b364118c3c16ac8b0f86d89cf7c3b6d2675e1f7f3d8ba9";

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

router.post("/mint", authenticateToken, (req, res) => {
  const { username, amount, eventId } = req.body;
  var selectQuery =
    "select * from users_table where username='" +
    username +
    "'";
  let existingAmount = 0;
  db.connect(function (err) {
    if (err) throw err;

    db.query(selectQuery, (err, rows) => {
      if (err) {
                res.status(500).send(err);
      }
      else {
            if (rows[0] == null) {
                res.status(500).send("User not exists");
            } 
      else {
          existingAmount = rows[0].tokenbalance;
          let updatedAmount = parseInt(existingAmount) + parseInt(amount);
          var updateQuery =
                "update users_table set tokenbalance =" + updatedAmount + " where username='" +
                username +"'";
                db.query(updateQuery, (err, rows) => {
                  if (err) {
                    console.log(err);
                      res.status(500).send(err);
                  }
                   else {
              let transaction = "" + username + updatedAmount + new Date().toDateString();
            let hash = crypto
              .createHash("sha256")
              .update(transaction)
              .digest("hex");
              res.json({ hash });
            }
          });
        }
      }
    });
  });
});

router.post("/transfer", authenticateToken, (req, res) => {
  const { username, amount, eventId } = req.body;

  var selectQuery =
    "select user_id,tokenbalance from users_table where username='" +
    username +
    "'";
  var selectQuery1 =
    "select funds_raised from events_table where event_id=" + eventId;
  let user_id = 0;

  let existingAmount = 0;
  let existingfundRaised = 0;
  console.log(selectQuery);
  var updateQuery =
    "insert into users_funds(id, user_id, event_id, fund_donated) values (?,?,?,?)";

  db.connect(function (err) {
    if (err) throw err;

    db.query(selectQuery, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        if (rows[0] == null) {
          res.status(500).send("User not exists");
        } else {
          existingAmount = rows[0].tokenbalance;
          user_id = rows[0].user_id;
          db.query(selectQuery1, (err, rows) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              if (rows[0] == null) {
                res.status(500).send("Event not exists");
              } else {
                existingfundRaised = rows[0].funds_raised;

                db.query(
                  updateQuery,
                  [0, user_id, eventId, amount],
                  (err, rows) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send(err);
                    } else {
                      var updateQuery1 =
                        "update users_table set tokenbalance =" +
                        Math.abs(existingAmount - amount) +
                        " where user_id=" +
                        user_id;
                      db.query(updateQuery1, (err, rows) => {
                        if (err) {
                          console.log(err);
                          res.status(500).send(err);
                        } else {
                          let updatedAmount =
                            parseInt(existingfundRaised) + parseInt(amount);
                          var updateQuery2 =
                            "update events_table set funds_raised =" +
                            updatedAmount +
                            " where event_id=" +
                            eventId;
                          db.query(updateQuery2, (err, rows) => {
                            if (err) {
                              console.log(err);
                              res.status(500).send("Transaction failed");
                            } else {
                              let transaction =
                                "" + user_id + updatedAmount + eventId + new Date().toDateString();
                              let hash = crypto
                                .createHash("sha256")
                                .update(transaction)
                                .digest("hex");
                              res.json({ hash });
                            }
                          });
                        }
                      });
                    }
                  }
                );
              }
            }
          });
        }
      }
    });
  });
});

// Simulate checking user token balance
router.get("/balance", authenticateToken, (req, res) => {
  var selectQuery =
    "select * from users_table where username='" + req.query["username"] + "'";
  db.connect(function (err) {
    if (err) throw err;
    db.query(selectQuery, (err, rows) => {
      if (err) {
        res.status(500).send("User not found");
      } else {
        if (rows[0] == null) {
          res.status(500).send("User not found");
        } else res.json(rows[0].tokenbalance);
      }
    });
  });
});

module.exports = router;
