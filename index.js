const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

const userRoutes = require("./routes/userRoutes");
const blockchainRoutes = require("./routes/blockchainRoute");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/blockchain", blockchainRoutes);
const port = process.env.PORT || 5000;


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;