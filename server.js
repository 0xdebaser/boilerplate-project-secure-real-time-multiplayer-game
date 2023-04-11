require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const cors = require("cors");
const getRandomCoords = require("./utils/getRandomCoords.js");
const helmet = require("helmet");
const socket = require("socket.io");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Helmet for tests
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
const io = socket(server);
const randomCoords = getRandomCoords();
const players = {
  carrot: {
    id: "carrot",
    x: randomCoords[0],
    y: randomCoords[1],
    value: 1,
  },
};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  io.to(socket.id).emit("your id", { id: socket.id });

  function broadcastUpdate() {
    io.emit("player update from server", players);
  }

  socket.on("player update from client", (data) => {
    players[data.id] = {
      id: data.id,
      x: data.x,
      y: data.y,
      score: data.score,
    };
    if (data.collision) {
      const newCoords = getRandomCoords();
      players.carrot.x = newCoords[0];
      players.carrot.y = newCoords[1];
    }
    broadcastUpdate();
  });

  socket.on("disconnect", (data) => {
    delete players[socket.id];
    broadcastUpdate();
  });
});

module.exports = app; // For testing
