import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";

window.onload = () => {
  /*global io*/
  const socket = io();
  const canvas = document.getElementById("game-window");
  const context = canvas.getContext("2d");

  context.fillStyle = "(rgb(52, 52, 52)";
  context.fillRect(0, 0, 640, 480);

  let players;
  let carrot;
  let myPlayer;

  function getRandomCoords() {
    const xMin = 50;
    const xMax = 600;
    const yMin = 50;
    const yMax = 440;
    const x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    const y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
    return [x, y];
  }

  function drawPlayers() {
    context.fillStyle = "black";
    context.fillRect(0, 0, 640, 480);
    context.fillStyle = "white";
    context.font = "24px monospace";
    context.fillText(`Score: ${myPlayer.score}`, 10, 20);
    const playersArray = [];
    const playerIds = Object.keys(players);
    playerIds.forEach((playerId) => {
      if (players[playerId].id != "carrot") {
        playersArray.push(players[playerId]);
        const img = new Image();
        img.onload = () => {
          context.drawImage(
            img,
            players[playerId].x,
            players[playerId].y,
            69,
            39
          );
        };
        img.src = "./public/images/gp.png";
      }
    });
    context.fillText(myPlayer.calculateRank(playersArray), 500, 20);
    carrot = new Collectible({
      id: players.carrot.id,
      x: players.carrot.x,
      y: players.carrot.y,
      value: players.carrot.value,
    });
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, carrot.x, carrot.y);
    };
    img.src = "./public/images/carrot.png";
  }

  function sendUpdateToServer(collision) {
    socket.emit("player update from client", {
      id: myPlayer.id,
      x: myPlayer.x,
      y: myPlayer.y,
      score: myPlayer.score,
      collision,
    });
  }

  // Event listener for movements
  document.addEventListener("keydown", (event) => {
    const code = event.code;
    const speed = 6;
    let direction;
    if (code == "KeyA" || code == "ArrowLeft") direction = "left";
    if (code == "KeyD" || code == "ArrowRight") direction = "right";
    if (code == "KeyW" || code == "ArrowUp") direction = "up";
    if (code == "KeyS" || code == "ArrowDown") direction = "down";
    if (direction) {
      myPlayer.movePlayer(direction, speed);
      const collision = myPlayer.collision(carrot);
      sendUpdateToServer(collision);
    }
  });

  socket.on("your id", (data) => {
    // Create new player and send data to server
    console.log(data.id);
    const startingCoordinates = getRandomCoords();
    myPlayer = new Player({
      x: startingCoordinates[0],
      y: startingCoordinates[1],
      score: 0,
      id: data.id,
    });
    sendUpdateToServer();
  });

  socket.on("player update from server", (data) => {
    players = data;
    drawPlayers();
  });
};
