class Player {
  constructor({ x, y, score, id }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.canvasWidth = 640;
    this.canvasHeight = 480;
    this.playerWidth = 69;
    this.playerHeight = 39;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        if (this.y > 0) {
          this.y -= speed;
        }
        break;
      case "down":
        if (this.y < this.canvasHeight - this.playerHeight) {
          this.y += speed;
        }
        break;
      case "left":
        if (this.x > 0) {
          this.x -= speed;
        }
        break;
      case "right":
        if (this.x < this.canvasWidth - this.playerWidth) {
          this.x += speed;
        }
    }
  }

  collision(item) {
    const carrotCenterX = item.x + 12;
    const carrotCenterY = item.y + 25;
    let collided;
    if (
      this.x < carrotCenterX &&
      this.y < carrotCenterY &&
      carrotCenterX - this.x < 6 + 69 &&
      carrotCenterY - this.y < 20 + 39
    )
      collided = true;
    if (
      this.x > carrotCenterX &&
      this.y < carrotCenterY &&
      this.x - carrotCenterX < 6 &&
      carrotCenterY - this.y < 20 + 39
    )
      collided = true;
    if (
      this.x < carrotCenterX &&
      this.y > carrotCenterY &&
      carrotCenterX - this.x < 6 + 69 &&
      this.y - carrotCenterY < 20
    )
      collided = true;
    if (
      this.x > carrotCenterX &&
      this.y > carrotCenterY &&
      this.x - carrotCenterX < 6 &&
      this.y - carrotCenterY < 20
    )
      collided = true;
    if (collided) this.score += item.value;
    return collided;
  }

  calculateRank(playersArray) {
    let rank = 1;
    playersArray.forEach((player) => {
      if (player.id != this.id && player.score > this.score) rank++;
    });
    return `Rank: ${rank}/${playersArray.length}`;
  }
}

export default Player;
